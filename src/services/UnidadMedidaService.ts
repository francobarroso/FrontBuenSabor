import UnidadMedida from "../types/UnidadMedida";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function UnidadMedidaCreate(unidadMedida: UnidadMedida, token: string) {
	const urlServer = `${apiUrl}/unidadMedida`;
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

	return {
		status: response.status,
		data: responseData as UnidadMedida
	};
}

export async function UnidadMedidaGetAll(token: string) {
	const urlServer = `${apiUrl}/unidadMedida`;
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

export async function UnidadMedidaGetById(id: number, token: string) {
	const urlServer = `${apiUrl}/unidadMedida/${id}`;
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

export async function UnidadMedidaUpdate(unidadMedida: UnidadMedida, token: string) {
	const urlServer = `${apiUrl}/unidadMedida/${unidadMedida.id}`;
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

	return {
		status: response.status,
		data: responseData as UnidadMedida
	};
}

export async function UnidadMedidaDelete(id: number, token: string) {
	const urlServer = `${apiUrl}/unidadMedida/${id}`;
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