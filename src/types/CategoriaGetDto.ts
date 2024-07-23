import CategoriaShortDto from "./CategoriaShortDto";
import Sucursal from "./Sucursal";

export default interface CategoriaGetDto{
    id: number | null,
    eliminado: boolean
    denominacion: string,
    esInsumo: boolean,
    sucursales: Sucursal[] | null,
    subCategorias: CategoriaGetDto[] | null,
    categoriaPadre: CategoriaShortDto | null
}