import { useSyncExternalStore } from 'react';
import { findDish } from '../api';
import { readStorage, writeStorage } from './storage';

const CART_KEY = 'mesob_cart';

export const COUPON_CODE = 'GURSHA2025';
export const COUPON_DISCOUNT = 200;
export const FREE_DELIVERY_MIN = 1200;

const PACKAGING_FEE = 60;
const DELIVERY_FEE = 80; // for bouseole zone
const VAT_RATE = 0.15;

const lineKey = (id, option) => id + '|' + (option || '');

const makeLine = (dish, qty, opts = {}) => {
  const optionPrice = opts.optionPrice || 0;
  const unitPrice = dish.price + optionPrice;
  return {
    id: dish.id,
    name: dish.name,
    option: opts.option || null,
    optionPrice,
    unitPrice,
    qty,
    lineTotal: unitPrice * qty,
  };
};

// የ seed ፓኬቱን  — ከሄደሩ ተመሳሳይ ለማድረግ (i use react Docmentatioons )
// A new visitor should always begin with an empty basket
// must never make an order on a customer's behalf.

const defaultState = { items: [], coupon: null, orderNote: '' };
const savedState = readStorage(CART_KEY, defaultState);
let state = {
  items: Array.isArray(savedState?.items)
    ? savedState.items
    : defaultState.items,
  coupon: savedState?.coupon === COUPON_CODE ? COUPON_CODE : null,
  orderNote:
    typeof savedState?.orderNote === 'string' ? savedState.orderNote : '',
};
const listeners = new Set();

const setState = (patch) => {
  state = { ...state, ...patch };
  writeStorage(CART_KEY, state); // always save the current for storage
  listeners.forEach((l) => l());
};
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function CartProvider({ children }) {
  return children;
}

export function useCart() {
  useSyncExternalStore(subscribe, () => state);
  const { items, coupon, orderNote } = state;

  const addItem = (id, qty = 1, opts = {}) => {
    const dish = findDish(id);
    if (!dish) return;
    const key = lineKey(id, opts.option);
    const existing = items.find((i) => lineKey(i.id, i.option) === key);
    if (existing) {
      const q = existing.qty + qty;
      setState({
        items: items.map((i) =>
          lineKey(i.id, i.option) === key
            ? { ...i, qty: q, lineTotal: i.unitPrice * q }
            : i
        ),
      });
    } else {
      setState({ items: [...items, makeLine(dish, qty, opts)] });
    }
  };

  const updateQty = (id, option, qty) => {
    const key = lineKey(id, option);
    setState({
      items:
        qty <= 0
          ? items.filter((i) => lineKey(i.id, i.option) !== key)
          : items.map((i) =>
              lineKey(i.id, i.option) === key
                ? { ...i, qty, lineTotal: i.unitPrice * qty }
                : i
            ),
    });
  };

  const removeItem = (id, option) => {
    const key = lineKey(id, option);
    setState({ items: items.filter((i) => lineKey(i.id, i.option) !== key) });
  };

  const clearCart = () => setState({ items: [], coupon: null, orderNote: '' });

  const applyCoupon = (code) => {
    if ((code || '').trim().toUpperCase() === COUPON_CODE) {
      setState({ coupon: COUPON_CODE });
      return { ok: true };
    }
    setState({ coupon: null });
    return { ok: false };
  };

  const setOrderNote = (orderNote) => setState({ orderNote });

  //  UI labels promise) ----
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0);
  const packaging = count === 0 ? 0 : PACKAGING_FEE;
  const freeDelivery = subtotal >= FREE_DELIVERY_MIN;
  const delivery = count === 0 ? 0 : freeDelivery ? 0 : DELIVERY_FEE;
  const vat = Math.round((subtotal + packaging + delivery) * VAT_RATE);
  const discount = coupon ? COUPON_DISCOUNT : 0;
  const grand = Math.max(0, subtotal + packaging + delivery + vat - discount);

  return {
    items,
    coupon,
    orderNote,
    count,
    subtotal,
    packaging,
    delivery,
    freeDelivery,
    vat,
    discount,
    grand,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    applyCoupon,
    setOrderNote,
  };
}
