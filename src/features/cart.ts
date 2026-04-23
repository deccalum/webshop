/**
 * Cart item: minimal representation storing only product reference + quantity
 */
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
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  getItems: () => CartItem[];
  getCount: () => number; // total items across quantities
  getTotal: (priceFn: (productId: number) => number) => number;
}

/**
 * Factory: create a new cart manager
 * @param initialItems optional items to hydrate cart (e.g., from storage)
 */
export function createCart(initialItems: CartItem[] = []): Cart {
  let items = [...initialItems];

  return {
    items,

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

    getItems: () => [...items],

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
 * localStorage utilities (SSR-safe)
 */
function isSSR(): boolean {
  return typeof window === "undefined";
}

export function loadCartFromStorage(storageKey: string): CartItem[] {
  if (isSSR()) return [];
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(
  storageKey: string,
  items: CartItem[]
): void {
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