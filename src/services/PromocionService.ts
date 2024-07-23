import Promocion from "../types/Promocion";

export async function PromocionCreate(promocion: Promocion, token: string){
	const urlServer = 'http://localhost:8080/promocion';
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
	const urlServer = 'http://localhost:8080/promocion/findBySucursal/' + id;
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
	const urlServer = 'http://localhost:8080/promocion';
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
	const urlServer = 'http://localhost:8080/promocion/' + id;
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
	const urlServer = 'http://localhost:8080/promocion/' + promocion.id;
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
	const urlServer = 'http://localhost:8080/promocion/' + id;
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