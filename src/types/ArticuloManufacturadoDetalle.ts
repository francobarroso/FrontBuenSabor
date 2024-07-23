import ArticuloInsumo from "./ArticuloInsumo";
import Base from "./Base";

export default interface ArticuloManufacturadoDetalle extends Base{
    cantidad: number,
    articuloInsumo: ArticuloInsumo
}