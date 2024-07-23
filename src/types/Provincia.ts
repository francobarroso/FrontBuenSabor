import Base from "./Base";
import Pais from "./Pais";

export default interface Provincia extends Base{
    nombre: string,
    pais: Pais
}