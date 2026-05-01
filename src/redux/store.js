import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import apiMiddleware from '../utils/ApiMidddleware/ApiMiddleware';
import basic_reducer from './Reducer/BasicReducer';
import callbackReducer from './Reducer/callbackReducer';

const rootReducer = combineReducers({
  basic_reducer,
  callbackReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk, apiMiddleware));

export default store;


