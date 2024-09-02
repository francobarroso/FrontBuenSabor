import ArticuloInsumo from "../types/ArticuloInsumo";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function ArticuloInsumoCreate(articuloInsumo: ArticuloInsumo, token: string){
	const urlServer = `${apiUrl}/articuloInsumo`;
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(articuloInsumo),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as ArticuloInsumo
	};
}

export async function ArticuloInsumoFindBySucursal(id: number, token: string){
	const urlServer = `${apiUrl}/articuloInsumo/findBySucursal/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo[];
}

export async function ArticuloInsumoGetAll(token: string){
	const urlServer = `${apiUrl}/articuloInsumo`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo[];
}

export async function ArticuloInsumoGetAllParaVender(id: number, token: string){
	const urlServer = `${apiUrl}/articuloInsumo/paraVenta/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo[];
}

export async function ArticuloInsumoGetById(id: number, token: string){
	const urlServer = `${apiUrl}/articuloInsumo/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloInsumo;
}

export async function ArticuloInsumoUpdate(articuloInsumo: ArticuloInsumo, token: string){
	const urlServer = `${apiUrl}/articuloInsumo/${articuloInsumo.id}`;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(articuloInsumo),
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

export async function ArticuloInsumoDelete(id: number, token: string){
	const urlServer = `${apiUrl}/articuloInsumo/${id}`;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const status = response.status;
    const data = await response.json();

    return { status, data };
}