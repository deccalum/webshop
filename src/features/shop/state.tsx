import { createContext, type Dispatch, useContext, useMemo, useReducer, type ReactNode } from "react";
import { SHOP_PRICE_DEFAULT } from "./types";
import type { ShopFilterState, SortKey } from "./types";

type ShopFilterAction =
  | { type: "toggleCategory"; category: string }
  | { type: "clearCategories" }
  | { type: "setMaxPrice"; value: number }
  | { type: "setInStockOnly"; value: boolean }
  | { type: "setPriceDropOnly"; value: boolean }
  | { type: "setSearchQuery"; value: string }
  | { type: "setSortKey"; value: SortKey }
  | { type: "resetAll" };

const INITIAL_STATE: ShopFilterState = {
  selectedCategories: [],
  maxPrice: SHOP_PRICE_DEFAULT,
  inStockOnly: false,
  priceDropOnly: false,
  sortKey: "",
  searchQuery: ""
};

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

const ShopFiltersContext = createContext<{
  state: ShopFilterState;
  dispatch: Dispatch<ShopFilterAction>;
} | null>(null);

function ShopFiltersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shopFilterReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ShopFiltersContext.Provider value={value}>
      {children}
    </ShopFiltersContext.Provider>
  );
}

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