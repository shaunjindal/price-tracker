import { createContext, useContext, useMemo, useReducer } from 'react';
import { orderReducer } from '../utils/orderReducer';
import { getOrderTotals } from '../utils/orderMath';

const OrderContext = createContext(null);
let manualCounter = 0;

export function OrderProvider({ children }) {
  const [items, dispatch] = useReducer(orderReducer, []);

  const value = useMemo(
    () => ({
      items,
      totals: getOrderTotals(items),
      setItem: (product, qty, customPricing) =>
        dispatch({ type: 'SET_ITEM', product, qty, customPricing }),
      // Manual items are normal order lines with a generated product (no discount).
      addManualItem: ({ name, price, qty }) => {
        manualCounter += 1;
        const product = {
          id: `manual-${Date.now()}-${manualCounter}`,
          name,
          price,
          salePrice: price,
          discount: null,
          details: {},
          description: '',
          image: null,
          isManual: true,
        };
        dispatch({ type: 'SET_ITEM', product, qty, customPricing: null });
      },
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      setPricing: (id, customPricing) => dispatch({ type: 'SET_PRICING', id, customPricing }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [items]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>');
  return ctx;
}
