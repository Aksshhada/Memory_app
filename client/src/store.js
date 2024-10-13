// src/store.js
import { createStore, combineReducers } from 'redux';
import postsReducer from './reducers/posts'; // Import your posts reducer here

const rootReducer = combineReducers({
  posts: postsReducer,
  // Add other reducers here if needed
});

const store = createStore(rootReducer);

export default store;
