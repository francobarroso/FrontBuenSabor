import Cliente from "./Cliente.ts";
import DetallePedido from "./DetallePedido.ts";
import Domicilio from "./Domicilio";
import Empleado from "./Empleado";
import { Estado } from "./enums/Estado.ts";
import { FormaPago } from "./enums/FormaPago.ts";
import { TipoEnvio } from "./enums/TipoEnvio.ts";
import Sucursal from "./Sucursal";

export default interface Pedido{
    id: number | null;
    eliminado: boolean;
    total: number;
    totalCosto: number;
    fechaPedido: string;
    horaEstimadaFinalizacion: string,
    estado: Estado | null;
    tipoEnvio: TipoEnvio | null;
    formaPago: FormaPago | null;
    domicilio: Domicilio | null;
    sucursal: Sucursal | undefined;
    cliente: Cliente | undefined;
    detallePedidos: DetallePedido[];
    empleado: Empleado | undefined;
}