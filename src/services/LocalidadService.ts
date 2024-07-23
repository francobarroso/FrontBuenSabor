import Localidad from "../types/Localidad";

export async function LocalidadGetAllByProvincia(id: number, token: string){
	const urlServer = 'http://localhost:8080/localidad/findByProvincia/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Localidad[];
}