import ArticuloManufacturado from "../types/ArticuloManufacturado";

export async function ArticuloManufacturadoCreate(articuloManufacturado: ArticuloManufacturado, token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(articuloManufacturado),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	
	const responseData = await response.json() as ArticuloManufacturado;
	const status = response.status;
	return {
		status,
		responseData
	};
}

export async function ArticuloManufacturadoFindBySucursal(id: number, token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado[];
}

export async function ArticuloManufacturadoGetAll(token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado[];
}

export async function ArticuloManufacturadoGetById(id: number, token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as ArticuloManufacturado;
}

export async function ArticuloManufacturadoUpdate(articuloManufacturado: ArticuloManufacturado, token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + articuloManufacturado.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(articuloManufacturado),
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

export async function ArticuloManufacturadoDelete(id: number, token: string){
	const urlServer = 'http://localhost:8080/articuloManufacturado/' + id;
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