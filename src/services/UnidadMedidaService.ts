import UnidadMedida from "../types/UnidadMedida";

export async function UnidadMedidaCreate(unidadMedida: UnidadMedida, token: string){
	const urlServer = 'http://localhost:8080/unidadMedida';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(unidadMedida),
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

export async function UnidadMedidaGetAll(token: string){
	const urlServer = 'http://localhost:8080/unidadMedida';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida[];
}

export async function UnidadMedidaGetById(id: number, token: string){
	const urlServer = 'http://localhost:8080/unidadMedida/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as UnidadMedida;
}

export async function UnidadMedidaUpdate(unidadMedida: UnidadMedida, token: string){
	const urlServer = 'http://localhost:8080/unidadMedida/' + unidadMedida.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(unidadMedida),
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

export async function UnidadMedidaDelete(id: number, token: string){
	const urlServer = 'http://localhost:8080/unidadMedida/' + id;
	const response = await fetch(urlServer, {
		method: 'DELETE',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData
	};
}