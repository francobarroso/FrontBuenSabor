import Imagen from "../types/Imagen";
const apiUrl = import.meta.env.VITE_API_SERVER_URL;

export async function CloudinaryPromocionUpload(file: File, token: string) {
    const urlServer = `${apiUrl}/imagen/promocion/upload`;
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

export async function CloudinaryPromocionDelete(publicId: string, id: string, token: string) {
    const urlServer = `${apiUrl}/imagen/promocion/deleteImg?publicId=${publicId}&id=${id}`;

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