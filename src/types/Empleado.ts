import Persona from "./Persona";
import SucursalShortDto from "./SucursalShortDto";

export default interface Empleado extends Persona{
    sucursal: SucursalShortDto | null;
}