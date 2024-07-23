import Articulo from "./Articulo";

export default interface ArticuloInsumo extends Articulo{
    precioCompra: number | null,
    stockActual: number | null,
    stockMaximo: number | null,
    stockMinimo: number | null,
    esParaElaborar: boolean
}