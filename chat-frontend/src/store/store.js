import { configureStore } from "@reduxjs/toolkit";
import groupReducer from './slice';

export const store = configureStore({
  reducer :{
    chat: groupReducer 
  }
});