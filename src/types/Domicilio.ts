import Base from "./Base";
import Localidad from "./Localidad";

export default interface Domicilio extends Base{
    calle: string,
    numero: number | null,
    cp: number | null,
    piso: number | null,
    nroDpto: number | null,
    localidad: Localidad | null
}