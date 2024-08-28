import { configureStore } from "@reduxjs/toolkit";
//import empresaSlice from "./slices/empresaSlice";
//import sucursalSlice from "./slices/sucursalSlice";

const persistanceMiddleware = (store: any) => (next: any) => (action: any) => {
  next(action);
  //localStorage.setItem("empresa", JSON.stringify(store.getState().empresa));
  //localStorage.setItem("sucursal", JSON.stringify(store.getState().sucursal));
}

export const store = configureStore({
  reducer: {
    //empresa: empresaSlice,
    //sucursal: sucursalSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistanceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;