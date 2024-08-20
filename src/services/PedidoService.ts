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