import Promocion from "../types/Promocion";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function PromocionCreate(promocion: Promocion, token: string){
	const urlServer = `${apiUrl}/promocion`;
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(promocion),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	
	const responseData = await response.json() as Promocion;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function PromocionFindBySucursal(id: number, token: string){
	const urlServer = `${apiUrl}/promocion/findBySucursal/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Promocion[];
}

export async function PromocionGetAll(token: string){
	const urlServer = `${apiUrl}/promocion`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Promocion[];
}

export async function PromocionGetById(id: number, token: string){
	const urlServer = `${apiUrl}/promocion/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Promocion;
}

export async function PromocionUpdate(promocion: Promocion, token: string){
	const urlServer = `${apiUrl}/promocion/${promocion.id}`;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(promocion),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});

	const responseData = await response.json();
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function PromocionDelete(id: number, token: string){
	const urlServer = `${apiUrl}/promocion/${id}`;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json() as string;
	const status = response.status;
	return {
		status,
		responseData
	};
}