import Base from "./Base";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";

export default interface Sucursal extends Base{
    nombre: string,
    horarioApertura: string,
    horarioCierre: string,
    esCasaMatriz: boolean,
    domicilio: Domicilio,
    empresa: Empresa | null
}