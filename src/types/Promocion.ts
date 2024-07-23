import Imagen from "./Imagen";
import PromocionDetalle from "./PromocionDetalle";
import SucursalShortDto from "./SucursalShortDto";
import { TipoPromocion } from "./enums/TipoPromocion";

export default interface Promocion{
    id: null,
    eliminado: boolean,
    denominacion: string,
    fechaDesde: string,
    fechaHasta: string,
    horaDesde: string,
    horaHasta: string,
    descripcionDescuento: string,
    precioPromocional: number | null,
    habilitado: boolean,
    tipoPromocion: TipoPromocion | null,
    imagenes: Imagen[],
    sucursales: SucursalShortDto[],
    promocionDetalles: PromocionDetalle[]
}