import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ordersReducer from './reducers/ordersReducer.js';

const rootReducer = combineReducers({
  orders: ordersReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;