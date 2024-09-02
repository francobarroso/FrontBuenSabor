import Sucursal from "../types/Sucursal";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function SucursalCreate(sucursal: Sucursal, token: string){
	const urlServer = `${apiUrl}/sucursal`;
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(sucursal),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Sucursal
	};
}

export async function SucursalGetByEmpresaId(id: number, token: string){
	const urlServer = `${apiUrl}/sucursal/empresa/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal[];
}

export async function SucursalGetAll(token: string){
	const urlServer = `${apiUrl}/sucursal`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal[];
}

export async function SucursalGetById(id: number, token: string){
	const urlServer = `${apiUrl}/sucursal/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Sucursal;
}

export async function SucursalUpdate(sucursal: Sucursal, token: string){
	const urlServer = `${apiUrl}/sucursal/${sucursal.id}`;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(sucursal),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Sucursal
	};
}