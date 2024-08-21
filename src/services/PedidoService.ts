import Pedido from "../types/Pedido";

export async function PedidoGetBySucursal(id: number){
	const urlServer = 'http://localhost:8080/pedido/findBySucursal/' + id;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Pedido[];
}

export async function GananciaGetByFecha(startDate: string, endDate: string){
	const urlServer = `http://localhost:8080/pedido/gananciaByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Object[];
}

export async function ProductosGetByFecha(startDate: string, endDate: string){
	const urlServer = `http://localhost:8080/pedido/productosByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Object[];
}

export async function TotalGetByFecha(startDate: string, endDate: string){
	const urlServer = `http://localhost:8080/pedido/totalByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as number;
}