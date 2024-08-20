import ArticuloInsumo from "./ArticuloInsumo";
import ArticuloManufacturado from "./ArticuloManufacturado";
import Promocion from "./Promocion";

export default interface DetallePedido{
    id: number | null;
    eliminado: boolean;
    cantidad: number;
    subTotal: number | null;
    articulo: ArticuloManufacturado | ArticuloInsumo | null;
    promocion: Promocion
}