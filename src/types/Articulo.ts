import Base from "./Base";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

export default interface Articulo extends Base{
    denominacion: string,
    precioVenta: number | null,
    habilitado: boolean,
    imagenes: Imagen[],
    unidadMedida: UnidadMedida,
    categoria: Categoria
}