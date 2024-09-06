const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function ReporteGanancias(startDate: string, endDate: string, id: number) {
    try {
        const urlServer = `${apiUrl}/reportes/ganancias?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idSucursal=${id}`;
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors'
        });
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = "ganancias.xls";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.log("Error al generar archivo excel de ganancias: ", error);
    }
}

export async function ReporteProductos(startDate: string, endDate: string, id: number) {
    try {
        const urlServer = `${apiUrl}/reportes/productos?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idSucursal=${id}`;
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors'
        });
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = "productos.xls";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.log("Error al generar archivo excel de productos: ", error);
    }
}