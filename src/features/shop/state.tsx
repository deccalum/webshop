// state.tsx - manages the state of shop filters using React Context and useReducer

import { createContext, type Dispatch, useContext, useMemo, useReducer, type ReactNode } from "react";
import { SHOP_PRICE_DEFAULT } from "./types";
import type { ShopFilterState, SortKey } from "./types";

/**
 * Individual actions that can update the shop filter state.
 *
 * @remarks
 * Each action corresponds to one UI control or reset behavior.
 */
type ShopFilterAction =
  | { type: "toggleCategory"; category: string }
  | { type: "clearCategories" }
  | { type: "setMaxPrice"; value: number }
  | { type: "setInStockOnly"; value: boolean }
  | { type: "setPriceDropOnly"; value: boolean }
  | { type: "setSearchQuery"; value: string }
  | { type: "setSortKey"; value: SortKey }
  | { type: "resetAll" };

/**
 * Default filter state used when the provider first mounts.
 *
 * @remarks
 * The reducer also returns this state when `resetAll` is dispatched.
 */
const INITIAL_STATE: ShopFilterState = {
  selectedCategories: [],
  maxPrice: SHOP_PRICE_DEFAULT,
  inStockOnly: false,
  priceDropOnly: false,
  sortKey: "",
  searchQuery: ""
};

/**
 * Applies one filter action to the current state.
 *
 * @param state The current filter state.
 * @param action The requested update.
 * @returns The next filter state.
 */
function shopFilterReducer(state: ShopFilterState, action: ShopFilterAction): ShopFilterState {
  switch (action.type) {
    case "toggleCategory": {
      const exists = state.selectedCategories.includes(action.category);
      return {
        ...state,
        selectedCategories: exists
        ? state.selectedCategories.filter((c) => c !== action.category)
          : [...state.selectedCategories, action.category],
      };
    }
    case "clearCategories":
      return { ...state, selectedCategories: [] };
    case "setMaxPrice":
      return { ...state, maxPrice: action.value };
    case "setInStockOnly":
      return { ...state, inStockOnly: action.value };
    case "setPriceDropOnly":
      return { ...state, priceDropOnly: action.value };
    case "setSortKey":
      return { ...state, sortKey: action.value };
    case "setSearchQuery":
      return { ...state, searchQuery: action.value };
    case "resetAll":
      return INITIAL_STATE;
    default:
      return state;
  }
}

/**
 * The values shared by the shop filters context.
 *
 * @remarks
 * Consumers read `state` and call `dispatch` indirectly through the hook below.
 */
interface ShopFiltersContextValue {
  state: ShopFilterState;
  dispatch: Dispatch<ShopFilterAction>;
}

/**
 * React context that stores the shop filter state and reducer dispatch.
 */
const ShopFiltersContext = createContext<ShopFiltersContextValue | null>(null);

/**
 * Provides shop filter state to all child components.
 *
 * @remarks
 * This component owns the reducer state and makes it available through context.
 *
 * @param children Components that need access to shop filters.
 * @returns A context provider wrapping the children.
 */
function ShopFiltersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shopFilterReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ShopFiltersContext.Provider value={value}>
      {children}
    </ShopFiltersContext.Provider>
  );
}

/**
 * Reads the current shop filter state and exposes helper actions.
 *
 * @remarks
 * This hook hides raw reducer action objects behind friendly methods such as
 * `toggleCategory`, `setMaxPrice`, and `resetAll`.
 *
 * @returns The filter state plus helper methods for updating it.
 * @throws When used outside of `ShopFiltersProvider`.
 */
function useShopFilters() {
  const context = useContext(ShopFiltersContext);

  if (!context) {
    throw new Error("useShopFilters must be used within ShopFiltersProvider");
  }

  const { state, dispatch } = context;

  return {
    state,
    toggleCategory: (category: string) =>
      dispatch({ type: "toggleCategory", category }),
    clearCategories: () => dispatch({ type: "clearCategories" }),
    setMaxPrice: (value: number) => dispatch({ type: "setMaxPrice", value }),
    setInStockOnly: (value: boolean) =>
      dispatch({ type: "setInStockOnly", value }),
    setPriceDropOnly: (value: boolean) =>
      dispatch({ type: "setPriceDropOnly", value }),
    setSortKey: (value: SortKey) => dispatch({ type: "setSortKey", value }),
    setSearchQuery: (value: string) => dispatch({ type: "setSearchQuery", value }),
    resetAll: () => dispatch({ type: "resetAll" }),
  };
}

export { ShopFiltersProvider, useShopFilters };
export type { ShopFilterState, ShopFilterAction };