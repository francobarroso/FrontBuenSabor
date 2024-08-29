import Empresa from "../types/Empresa";

export async function EmpresaCreate(empresa: Empresa, token: string){
	const urlServer = 'http://localhost:8080/empresa';
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(empresa),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Empresa
	};
}

export async function EmpresaGetAll(token: string){
	const urlServer = 'http://localhost:8080/empresa';
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empresa[];
}

export async function EmpresaGetById(id: number, token: string){
	const urlServer = 'http://localhost:8080/empresa/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empresa;
}

export async function EmpresaUpdate(empresa: Empresa, token: string){
	const urlServer = 'http://localhost:8080/empresa/' + empresa.id;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(empresa),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Empresa
	};
}

export async function EmpresaGetBySucursal(id: number, token: string){
	const urlServer = 'http://localhost:8080/empresa/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empresa;
}