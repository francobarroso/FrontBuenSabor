import Provincia from "../types/Provincia";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function ProvinciaGetAll(token: string){
	const urlServer = `${apiUrl}/provincia`;
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