import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import empresaSlice from "./slices/empresaSlice";
import sucursalSlice from "./slices/sucursalSlice";

const persistanceMiddleware = (store: any) => (next: any) => (action: any) => {
  next(action);
  if (action.type.startsWith("empresa/")) {
    localStorage.setItem("empresa", JSON.stringify(store.getState().empresa));
  }
  if (action.type.startsWith("sucursal/")) {
    localStorage.setItem("sucursal", JSON.stringify(store.getState().sucursal));
  }
  if (action.type.startsWith("user/")) {
    localStorage.setItem("user", JSON.stringify(store.getState().user));
  }
}

export const store = configureStore({
  reducer: {
    empresa: empresaSlice,
    sucursal: sucursalSlice,
    user: userSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistanceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;