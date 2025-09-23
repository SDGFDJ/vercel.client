import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  order: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState: initialValue,
  reducers: {
    setOrder: (state, action) => {
      state.order = [...action.payload];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      state.order = state.order.map(o =>
        o.orderId === orderId
          ? {
              ...o,
              payment_status: status === "DELIVERED" ? "COMPLETED" : status,
              statusHistory: o.statusHistory
                ? [...o.statusHistory, { status, updatedAt: new Date() }]
                : [{ status, updatedAt: new Date() }]
            }
          : o
      );
    },
    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        statusHistory: action.payload.statusHistory || [{ status: "PLACED", updatedAt: new Date() }]
      };
      state.order.push(newOrder);
    },
    removeOrder: (state, action) => {
      const orderId = action.payload;
      state.order = state.order.filter(o => o.orderId !== orderId);
    },
  },
});

export const { setOrder, updateOrderStatus, addOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
