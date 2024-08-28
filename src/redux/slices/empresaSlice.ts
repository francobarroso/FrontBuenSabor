/*import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Empresa from "../../types/Empresa";

const DEFAULT_STATE = {
    empresa: null
}

interface initialStateEntity {
    empresa: Empresa | null
};

const initialState: initialStateEntity = (()=>{
    const persistedState = localStorage.getItem("empresa");
    if(persistedState){
        return JSON.parse(persistedState).empresa;
    }
    return DEFAULT_STATE;
})();

export const empresaSlice = createSlice({
    name: "empresa",
    initialState,
    reducers: {
        setEmpresa: (state, action: PayloadAction<Empresa | null>) => {
            const empresa = action.payload;
            state.empresa = empresa;
        }
    }
});

export const {setEmpresa} = empresaSlice.actions;
export default empresaSlice.reducer;*/