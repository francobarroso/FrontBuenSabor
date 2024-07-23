import Articulo from "./Articulo";

export default interface PromocionDetalle{
    id: null,
    eliminado: boolean,
    cantidad: number,
    articulo: Articulo
}