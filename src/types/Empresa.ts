import Base from "./Base";

export default interface Empresa extends Base{
    nombre: string,
    razonSocial: string,
    cuil: number | null
}