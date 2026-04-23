// cart.ts - pure cart state management + localStorage utilities

export interface CartItem {
  productId: number;
  quantity: number;
  addedAt: number;
}

export const CART_STORAGE_KEY = "cart";
export const CART_UPDATED_EVENT = "cart:updated";

/**
 * Cart operations: pure state manager for cart items
 * Does not store full Product objects—only productId + quantity
 * Price lookups delegated to caller via priceFn
 */
export interface Cart {
  addItem: (productId: number, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  getItems: () => CartItem[];
  getCount: () => number;
  getTotal: (priceFn: (productId: number) => number) => number;
}

/**
 * Factory: create a new cart manager
 * @param initialItems optional items to hydrate cart (e.g., from storage)
 */
export function createCart(initialItems: CartItem[] = []): Cart {
  let items = [...initialItems];

  return {
    getItems: () => [...items],

    addItem: (productId: number, quantity = 1) => {
      const existing = items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ productId, quantity, addedAt: Date.now() });
      }
    },

    removeItem: (productId: number) => {
      items = items.filter((item) => item.productId !== productId);
    },

    updateQuantity: (productId: number, quantity: number) => {
      const item = items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          items = items.filter((i) => i.productId !== productId);
        }
      }
    },

    clear: () => {
      items = [];
    },

    getCount: () => {
      return items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getTotal: (priceFn: (productId: number) => number) => {
      return items.reduce(
        (sum, item) => sum + priceFn(item.productId) * item.quantity,
        0
      );
    },
  };
}

/**
 * Detects whether this code is running on the server instead of in a browser.
 *
 * @remarks
 * SSR means "Server-Side Rendering". In SSR, part of the app can run before the
 * browser loads the page. On the server there is no `window` object and no
 * `localStorage`, so browser-only APIs must be guarded before use.
 *
 * This helper is a small safety check used by the cart storage functions below.
 *
 * @returns `true` when `window` is not available.
 */
function isSSR(): boolean {
  return typeof window === "undefined";
}

/**
 * Loads saved cart items from browser storage.
 *
 * @remarks
 * What it does:
 * - reads the JSON string stored under the provided key
 * - converts that string back into an array of cart items
 * - returns an empty array if nothing was saved or if reading fails
 *
 * Why the SSR check matters:
 * - on the server there is no `localStorage`, so trying to read it would crash
 * - when SSR is true, this function returns `[]` immediately instead of failing
 *
 * @param storageKey The `localStorage` key to read from.
 * @returns The saved cart items, or an empty array if none exist.
 */
export function loadCartFromStorage(storageKey: string): CartItem[] {
  if (isSSR()) return [];
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Saves the current cart items to browser storage.
 *
 * @remarks
 * What it does:
 * - turns the cart items array into JSON
 * - stores that JSON in `localStorage`
 * - sends a `cart:updated` event so other parts of the app can refresh
 *
 * Why the SSR check matters:
 * - this function only works in a browser, because the server does not have
 *   `localStorage` or browser events
 * - when SSR is true, the function exits early and does nothing
 *
 * @param storageKey The `localStorage` key to write to.
 * @param items The cart items that should be saved.
 * @returns Nothing.
 */
export function saveCartToStorage(storageKey: string, items: CartItem[]): void {
  if (isSSR()) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(CART_UPDATED_EVENT, {
        detail: { storageKey, items },
      })
    );
  } catch {
    // Silent fail
  }
}