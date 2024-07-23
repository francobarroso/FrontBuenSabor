import Base from "./Base";
import Provincia from "./Provincia";

export default interface Localidad extends Base{
    nombre: string,
    provincia: Provincia
}