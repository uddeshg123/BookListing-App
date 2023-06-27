import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { booksReducer } from "./reducers";

const rootReducer = combineReducers({
    books: booksReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // disable the serializable check for redux-persist's actions
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export default store;

export const persistor = persistStore(store);

// infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;

// infer the `AppDispatch` type from the store so thunk actions can return promises
export type AppDispatch = typeof store.dispatch;

// reset persisted store when a user logs out
export const resetStore = () => {
  persistor.purge().then(() => persistor.flush());
};
