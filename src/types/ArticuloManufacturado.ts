import Articulo from "./Articulo";
import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";

export default interface ArticuloManufacturado extends Articulo{
    descripcion: string,
    tiempoEstimadoMinutos: number | null,
    preparacion: string,
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[] | null
}