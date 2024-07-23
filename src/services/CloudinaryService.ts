import Imagen from "../types/Imagen";

export async function CloudinaryUpload(file: File, token: string) {
    const urlServer = 'http://localhost:8080/imagen/articulo/upload';
    const formData = new FormData();

    formData.append('uploads', file);
    formData.append('upload_presets', 'buenSabor');

    const response = await fetch(urlServer, {
        method: 'POST',
        body: formData,
        headers: {
			'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return await response.json() as Imagen[];
}

export async function CloudinaryDelete(publicId: string, id: string, token: string) {
    const urlServer = `http://localhost:8080/imagen/articulo/deleteImg?publicId=${publicId}&id=${id}`;

    const response = await fetch(urlServer, {
        method: 'POST',
        headers: {
			'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    return await response.json();
}