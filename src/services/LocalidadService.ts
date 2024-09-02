import Localidad from "../types/Localidad";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function LocalidadGetAllByProvincia(id: number, token: string){
	const urlServer = `${apiUrl}/localidad/findByProvincia/${id}`;
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