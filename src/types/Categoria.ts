import Sucursal from "./Sucursal";

export default interface Categoria{
    id: number | null,
    eliminado: boolean
    denominacion: string,
    esInsumo: boolean,
    sucursales: Sucursal[] | null,
    subCategorias: Categoria[] | null
}