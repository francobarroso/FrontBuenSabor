import { Rol } from "./enums/Rol";

export default interface Usuario{
    id: number | null,
    eliminado: boolean
    userName: string,
    email: string,
    rol: Rol | null
}