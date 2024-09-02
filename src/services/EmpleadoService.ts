import Empleado from "../types/Empleado";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function EmpleadoCreate(empleado: Empleado, token: string){
	const urlServer = `${apiUrl}/empleado`;
	const response = await fetch(urlServer, {
		method: 'POST',
		body: JSON.stringify(empleado),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});

	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Empleado
	};
}

export async function EmpleadoGetBySucursal(id: number, token: string){
	const urlServer = `${apiUrl}/empleado/findBySucursal/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empleado[];
}

export async function EmpleadoGetAll(token: string){
	const urlServer = `${apiUrl}/empleado`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empleado[];
}

export async function EmpleadoGetById(id: number, token: string){
	const urlServer = `${apiUrl}/empleado/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	return await response.json() as Empleado;
}

export async function EmpleadoUpdate(empleado: Empleado, token: string){
	const urlServer = `${apiUrl}/empleado/${empleado.id}`;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(empleado),
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});

	const responseData = await response.json();

	return {
		status: response.status,
		data: responseData as Empleado
	};
}

export async function EmpleadoDelete(id: number, token: string){
	const urlServer = `${apiUrl}/empleado/${id}`;
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

export async function EmpleadoGetByEmail(email: string, token: string){
	const urlServer = `${apiUrl}/empleado/findByEmail?email=${email}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Authorization': `Bearer ${token}`,
			'Content-type': 'application/json',
		},
        mode: 'cors'
	});
	const status = response.status;
    const data = await response.json() as Empleado;

    return { status, data };
}