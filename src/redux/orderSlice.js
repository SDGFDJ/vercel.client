import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  order: {
    newPending: [],
    completed: [],
    cancelled: [],
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState: initialValue,
  reducers: {
    setOrder: (state, action) => {
      const allOrders = action.payload || [];
      state.order.newPending = allOrders.filter(o => !["COMPLETED", "CANCELLED"].includes(o.payment_status));
      state.order.completed = allOrders.filter(o => o.payment_status === "COMPLETED");
      state.order.cancelled = allOrders.filter(o => o.payment_status === "CANCELLED");
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const allOrders = [...state.order.newPending, ...state.order.completed, ...state.order.cancelled];
      const order = allOrders.find(o => o.orderId === orderId);
      if (!order) return;

      if (status === "DELIVERED") order.payment_status = "COMPLETED";
      else if (status === "CANCELLED") order.payment_status = "CANCELLED";
      else order.payment_status = status;

      order.statusHistory = order.statusHistory
        ? [...order.statusHistory, { status, updatedAt: new Date() }]
        : [{ status, updatedAt: new Date() }];

      // Re-split orders
      state.order.newPending = allOrders.filter(o => !["COMPLETED", "CANCELLED"].includes(o.payment_status));
      state.order.completed = allOrders.filter(o => o.payment_status === "COMPLETED");
      state.order.cancelled = allOrders.filter(o => o.payment_status === "CANCELLED");
    },
    removeOrder: (state, action) => {
      const orderId = action.payload;
      state.order.newPending = state.order.newPending.filter(o => o.orderId !== orderId);
      state.order.completed = state.order.completed.filter(o => o.orderId !== orderId);
      state.order.cancelled = state.order.cancelled.filter(o => o.orderId !== orderId);
    },
    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        statusHistory: action.payload.statusHistory || [{ status: "PLACED", updatedAt: new Date() }]
      };
      state.order.newPending.unshift(newOrder);
    },
  },
});

export const { setOrder, updateOrderStatus, addOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
