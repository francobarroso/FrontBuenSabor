import Pais from "../types/Pais";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function PaisGetAll(token: string){
	const urlServer = `${apiUrl}/pais`;
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