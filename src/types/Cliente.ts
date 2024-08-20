import Domicilio from "./Domicilio";
import Persona from "./Persona";

export default interface Cliente extends Persona{
    domicilios: Domicilio[];
}