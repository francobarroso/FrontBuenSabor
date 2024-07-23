import Usuario from "./Usuario";

export default interface Persona{
    id: number | null,
    eliminado: boolean
    nombre: string,
    apellido: string,
    telefono: string,
    fechaNacimiento: string,
    usuario: Usuario
}