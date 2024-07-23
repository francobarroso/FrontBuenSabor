import Pais from "../types/Pais";

export async function PaisGetAll(token: string){
	const urlServer = 'http://localhost:8080/pais';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Pais[];
}