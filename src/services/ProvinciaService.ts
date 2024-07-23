import Provincia from "../types/Provincia";

export async function ProvinciaGetAll(token: string){
	const urlServer = 'http://localhost:8080/provincia';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Provincia[];
}