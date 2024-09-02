import Pedido from "../types/Pedido";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function PedidoGetBySucursal(id: number){
    const urlServer = `${apiUrl}/pedido/findBySucursal/${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Pedido[];
}

export async function GananciaGetByFecha(startDate: string, endDate: string, id: number){
	const urlServer = `${apiUrl}/pedido/gananciaByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idSucursal=${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Object[];
}

export async function ProductosGetByFecha(startDate: string, endDate: string, id: number){
	const urlServer = `${apiUrl}/pedido/productosByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idSucursal=${id}`;
	const response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json'
		},
        mode: 'cors'
	});
	return await response.json() as Object[];
}

export async function TotalGetByFecha(startDate: string, endDate: string, id: number): Promise<number> {
    const urlServer = `${apiUrl}/pedido/totalByFecha?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idSucursal=${id}`;

    try {
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors'
        });

        // Verifica si la respuesta del servidor es exitosa
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
        }

        // Lee la respuesta como texto primero
        const text = await response.text();

        // Verifica si la respuesta no está vacía antes de parsear
        if (!text) {
			return 0;
        }

        // Intenta parsear la respuesta como JSON
        const parsedData = JSON.parse(text);

        // Asegúrate de que el valor parseado sea del tipo esperado (número)
        if (typeof parsedData !== 'number') {
            throw new Error("Unexpected data type received from server");
        }

        return parsedData;
    } catch (error) {
        console.error("Error fetching totals:", error);
        // Devuelve un valor predeterminado o maneja el error según sea necesario
        return 0; // o lanza el error si prefieres manejarlo en el componente
    }
}

export async function PedidoUpdate(pedido: Pedido){
    const urlServer = `${apiUrl}/pedido/${pedido.id}`;
	const response = await fetch(urlServer, {
		method: 'PUT',
		body: JSON.stringify(pedido),
        headers: {
			'Content-type': 'application/json'
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