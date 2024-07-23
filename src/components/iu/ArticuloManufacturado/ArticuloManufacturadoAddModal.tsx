import { Box, Button, Card, CardActions, CardContent, FormControl, FormHelperText, Grid, IconButton, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import { useEffect, useState } from "react";
import Imagen from "../../../types/Imagen";
import { useAuth0 } from "@auth0/auth0-react";
import { CategoriaByEmpresaGetAll } from "../../../services/CategoriaService";
import Categoria from "../../../types/Categoria";
import UnidadMedida from "../../../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../../../services/UnidadMedidaService";
import { useParams } from "react-router-dom";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { Delete } from "@mui/icons-material";
import { CloudinaryDelete, CloudinaryUpload } from "../../../services/CloudinaryService";
import CloseIcon from '@mui/icons-material/Close';
import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import ArticuloManufacturadoDetalle from "../../../types/ArticuloManufacturadoDetalle";
import { ArticuloInsumoFindBySucursal } from "../../../services/ArticuloInsumoService";
import { ArticuloManufacturadoCreate, ArticuloManufacturadoUpdate } from "../../../services/ArticuloManufacturadoService";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

interface ArticuloInsumoAddModalProps {
    open: boolean;
    onClose: () => void;
    articulo: ArticuloManufacturado;
    imagenes: string[];
    articuloImagenes: Imagen[];
    articuloDetalles: ArticuloManufacturadoDetalle[];
    success: () => void;
    error: () => void;
}

const ArticuloManufacturadoAddModal: React.FC<ArticuloInsumoAddModalProps> = ({ open, onClose, articulo, imagenes, articuloImagenes, articuloDetalles, success, error }) => {
    const [currentArticuloManufacturado, setCurrentArticuloManufacturado] = useState<ArticuloManufacturado>(articulo);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>(articuloDetalles);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>(imagenes);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articuloImagenes);
    const [search, setSearch] = useState("");
    const { idEmpresa, idSucursal } = useParams();
    const [modalStep, setModalStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { getAccessTokenSilently } = useAuth0();

    const createArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return ArticuloManufacturadoCreate(articulo, token);
    };

    const updateArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return ArticuloManufacturadoUpdate(articulo, token);
    };

    const getAllArticuloInsumoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(Number(idSucursal), token);
        setInsumos(articulosInsumo);
    };

    const getAllCategoriaByEmpresa = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const categorias: Categoria[] = await CategoriaByEmpresaGetAll(Number(idEmpresa), token);
        setCategorias(categorias);
    };

    const getAllUnidadMedida = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll(token);
        setUnidadMedidas(unidadMedidas);
    };

    const cloudinaryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prevFiles => [...prevFiles, ...newFiles]);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    const newImage = reader.result as string;
                    setImages(prevImages => [...prevImages, reader.result as string]);
                    if (currentArticuloManufacturado.id > 0) {
                        setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                    }
                };
                reader.readAsDataURL(file);
            });

            const name = 'files';
            if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        }
    };

    const cloudinaryUpload = async (): Promise<Imagen[]> => {
        if (files.length === 0) return [];

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });

            const imagenes = await Promise.all(files.map(file => CloudinaryUpload(file, token)));
            return imagenes.flat(); // Aplana el array de arrays
        } catch (error) {
            console.error('Error uploading the files', error);
            return [];
        }
    };


    const cloudinaryDelete = async (publicId: string, id: number) => {

        if (!publicId) return;

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });

            await CloudinaryDelete(publicId, id.toString(), token);
        } catch (error) {
            console.error('Error deleting the file', error);
        }

    };

    useEffect(() => {
        getAllCategoriaByEmpresa();
        getAllUnidadMedida();
    }, []);

    useEffect(() => {
        if (open) {
            getAllArticuloInsumoBySucursal();
            setImages(imagenes);
            setArticuloImages(articuloImagenes);
            if (currentArticuloManufacturado.id !== null && currentArticuloManufacturado.id > 0) {
                setDetalles(articuloDetalles);
            } else {
                setDetalles([]);
            }

        }
    }, [open, imagenes, articuloImagenes, articuloDetalles]);

    const deleteImages = async (imagenes: Imagen[]) => {
        try {
            for (let i = 0; i < imagenes.length; i++) {
                const match = imagenes[i].url.match(/.*\/([^/?]+).*$/);
                if (match) {
                    const publicId = match[1];
                    console.log(imagenes[i].url);
                    cloudinaryDelete(publicId, imagenes[i].id);
                }
            }
        } catch (error) {
            console.log("Error al eliminar las imagenes")
        }
    }

    const removeImage = (index: number) => {
        if (currentArticuloManufacturado.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }

    };

    const searcher = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    let results: ArticuloInsumo[] = [];

    if (!search) {
        results = [];
    } else {
        results = insumos.filter((insumo) =>
            insumo.denominacion.toLowerCase().includes(search.toLocaleLowerCase()));
    }

    const handleEliminar = (index: number) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(nuevosDetalles);
    };

    const handleCantidadChange = (index: number, cantidad: number) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index].cantidad = cantidad;
        if (nuevosDetalles[index].cantidad.toString().length > 3) {
            return;
        }
        setDetalles(nuevosDetalles);
    };

    const handleAgregar = (insumo: ArticuloInsumo) => {
        const nuevoDetalle = {
            id: 0,
            eliminado: false,
            cantidad: 1,
            articuloInsumo: insumo
        };
        const existe = detalles.some(detalle => detalle.articuloInsumo.id === insumo.id);

        if (!existe) {
            setDetalles([...detalles, nuevoDetalle]);
            setSearch("");
            setErrors(prev => ({
                ...prev,
                detalles: ''
            }));
        }
    };

    const handleNextStep = () => {
        setModalStep(modalStep + 1);
    };

    const handlePreviousStep = () => {
        setModalStep(modalStep - 1);
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, name: string) => {
        const value = e.target.value as number; // Asumiendo que el valor es un número (id)

        if (name === 'unidadMedida') {
            const unidadMedidaSeleccionada = unidadMedidas.find(u => u.id === value);
            setCurrentArticuloManufacturado(prevState => ({
                ...prevState,
                unidadMedida: unidadMedidaSeleccionada || emptyUnidadMedida
            }));
        } else if (name === 'categoria') {
            const categoriaSeleccionada = categorias.find(c => c.id === value);
            setCurrentArticuloManufacturado(prevState => ({
                ...prevState,
                categoria: categoriaSeleccionada || emptyCategoria
            }));
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const maxLength: Record<string, number> = {
            denominacion: 25,
            precioVenta: 6,
            tiempoEstimadoMinutos: 2,
            descripcion: 100,
            preparacion: 250
        };

        if (value.length > maxLength[name]) {
            return;
        }

        setCurrentArticuloManufacturado({ ...currentArticuloManufacturado, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentArticuloManufacturado.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!currentArticuloManufacturado.unidadMedida.id) {
            newErrors.unidadMedida = 'La unidad de medida es obligatoria.';
        }
        if (!currentArticuloManufacturado.categoria.id) {
            newErrors.categoria = 'La categoria es obligatoria.';
        }
        if (files.length === 0 && currentArticuloManufacturado.imagenes.length === 0) {
            newErrors.files = 'Las imagenes son obligatorias.';
        }
        if (!currentArticuloManufacturado.precioVenta) {
            newErrors.precioVenta = 'El precio de venta es obligatorio.';
        }
        if (!currentArticuloManufacturado.tiempoEstimadoMinutos) {
            newErrors.tiempoEstimadoMinutos = 'El tiempo estimado es obligatorio.';
        }
        if (!currentArticuloManufacturado.descripcion) {
            newErrors.descripcion = 'La descripción es obligatoria.';
        }
        if (!currentArticuloManufacturado.preparacion) {
            newErrors.preparacion = 'La preparación es obligatoria.';
        }
        if (detalles.length === 0) {
            newErrors.detalles = 'Los detalles son obligatorios.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setCurrentArticuloManufacturado(articulo);
        setModalStep(1);
        setFiles([]);
        setInsumos([]);
        setImages(imagenes);
        setSearch("");
        setErrors({});
        setArticuloImages(articuloImagenes);
        if (currentArticuloManufacturado.id !== null && currentArticuloManufacturado.id > 0) {
            if (currentArticuloManufacturado.id !== null && currentArticuloManufacturado.id > 0) {
                setDetalles(JSON.parse(JSON.stringify(currentArticuloManufacturado.articuloManufacturadoDetalles)));
            } else {
                setDetalles([]);
            }

        }

        onClose();
    }

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        const imagenes = await cloudinaryUpload();

        if (imagenes && imagenes?.length > 0) {
            imagenes.forEach(imagen => {
                articuloImages.push(imagen);
            });
        }

        if (articuloImages !== null) {
            currentArticuloManufacturado.imagenes = articuloImages;
        }

        currentArticuloManufacturado.articuloManufacturadoDetalles = detalles;

        if (currentArticuloManufacturado.id > 0) {
            try {
                const data = await updateArticuloManufacturado(currentArticuloManufacturado);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            }

        } else {
            try {

                const data = await createArticuloManufacturado(currentArticuloManufacturado);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al crear un articulo manufacturado.");
            }
        }

        success();
        handleClose();
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...modalStyle, overflow: 'auto', maxHeight: '80vh' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        {currentArticuloManufacturado.id === 0 ? 'Crear Articulo Manufacturado' : 'Actualizar Articulo Manufacturado'}
                    </Typography>
                    {
                        modalStep === 1 && (
                            <Box>
                                <FormControl fullWidth error={!!errors.denominacion}>
                                    <TextField
                                        name="denominacion"
                                        label="Denominacion"
                                        fullWidth
                                        margin="normal"
                                        value={currentArticuloManufacturado.denominacion}
                                        onChange={handleChange}
                                    />
                                    {errors.denominacion && <FormHelperText>{errors.denominacion}</FormHelperText>}
                                </FormControl>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth error={!!errors.unidadMedida}>
                                                <TextField
                                                    select
                                                    name="unidadMedidaId"
                                                    label="Unidad de Medida"
                                                    fullWidth
                                                    margin="normal"
                                                    value={currentArticuloManufacturado.unidadMedida?.id || ''}
                                                    onChange={(e) => handleSelectChange(e, 'unidadMedida')}
                                                >
                                                    {unidadMedidas.filter(unidad => !unidad.eliminado)
                                                        .map((unidad) => (
                                                            <MenuItem key={unidad.id} value={unidad.id}>
                                                                {unidad.denominacion}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                                {errors.unidadMedida && <FormHelperText>{errors.unidadMedida}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth error={!!errors.categoria}>
                                                <TextField
                                                    select
                                                    name="categoriaId"
                                                    label="Categoria"
                                                    fullWidth
                                                    margin="normal"
                                                    value={currentArticuloManufacturado.categoria?.id || ''}
                                                    onChange={(e) => handleSelectChange(e, 'categoria')}
                                                >
                                                    {categorias.filter(categoria => !categoria.esInsumo)
                                                        .filter(categoria => !categoria.eliminado)
                                                        .map((categoria) => (
                                                            <MenuItem key={categoria.id} value={categoria.id ?? ''}>
                                                                {categoria.denominacion}
                                                            </MenuItem>
                                                        ))}
                                                </TextField>
                                                {errors.categoria && <FormHelperText>{errors.categoria}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mt={3} mb={3}>
                                    <FormControl fullWidth error={!!errors.files}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
                                                Seleccione imágenes:
                                            </Typography>
                                            <label htmlFor="upload-button">
                                                <input
                                                    style={{ display: 'none' }}
                                                    id="upload-button"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={cloudinaryFileChange}
                                                />
                                                <ImageSearchIcon sx={{ fontSize: '50px', cursor: 'pointer', '&:hover': { color: '#3B3B3B' } }} />
                                            </label>
                                        </Box>
                                        {errors.files && <FormHelperText>{errors.files}</FormHelperText>}
                                    </FormControl>
                                    {currentArticuloManufacturado.id > 0 ?
                                        images.length > 0 && (
                                            <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
                                                {articuloImages.map((image, index) => (
                                                    !image.eliminado && (
                                                        <Box key={index} display="flex" alignItems="center" flexDirection="column" mr={2} mb={2}>
                                                            <img src={image.url} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                            <IconButton onClick={() => removeImage(image.id)} size="small">
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    )
                                                ))}
                                            </Box>
                                        )
                                        :
                                        images.length > 0 && (
                                            <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
                                                {images.map((image, index) => (
                                                    <Box key={index} display="flex" alignItems="center" flexDirection="column" mr={2} mb={2}>
                                                        <img src={image} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                        <IconButton onClick={() => removeImage(index)} size="small">
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )
                                    }
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth error={!!errors.precioVenta}>
                                            <TextField
                                                name="precioVenta"
                                                label="Precio de Venta"
                                                fullWidth
                                                margin="normal"
                                                type="decimal"
                                                value={currentArticuloManufacturado.precioVenta}
                                                onChange={handleChange}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    input.value = input.value.replace(/[^0-9]/g, '');
                                                }}
                                                inputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    min: 0,
                                                }}
                                            />
                                            {errors.precioVenta && <FormHelperText>{errors.precioVenta}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth error={!!errors.tiempoEstimadoMinutos}>
                                            <TextField
                                                name="tiempoEstimadoMinutos"
                                                label="Tiempo Estimado (minutos)"
                                                fullWidth
                                                margin="normal"
                                                type="decimal"
                                                value={currentArticuloManufacturado.tiempoEstimadoMinutos}
                                                onChange={handleChange}
                                                onInput={(e) => {
                                                    const input = e.target as HTMLInputElement;
                                                    input.value = input.value.replace(/[^0-9]/g, '');
                                                }}
                                                inputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    min: 0
                                                }}
                                            />
                                            {errors.tiempoEstimadoMinutos && <FormHelperText>{errors.tiempoEstimadoMinutos}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button disabled onClick={handlePreviousStep} color="secondary" variant="contained">
                                        Atrás
                                    </Button>
                                    <Button onClick={handleNextStep} color="primary" variant="contained">
                                        Siguiente
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    {modalStep === 2 && (
                        <Box>
                            <FormControl fullWidth error={!!errors.descripcion}>
                                <TextField
                                    name="descripcion"
                                    label="Descripcion"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    value={currentArticuloManufacturado.descripcion}
                                    onChange={handleChange}
                                />
                                {errors.descripcion && <FormHelperText>{errors.descripcion}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth error={!!errors.preparacion}>
                                <TextField
                                    name="preparacion"
                                    label="Preparacion"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={5}
                                    value={currentArticuloManufacturado.preparacion}
                                    onChange={handleChange}
                                />
                                {errors.preparacion && <FormHelperText>{errors.preparacion}</FormHelperText>}
                            </FormControl>
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button onClick={handlePreviousStep} color="secondary" variant="contained">
                                    Atrás
                                </Button>
                                <Button onClick={handleNextStep} color="primary" variant="contained">
                                    Siguiente
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {modalStep === 3 && (
                        <Box>
                            <FormControl fullWidth error={!!errors.detalles}>
                                <TextField
                                    name="buscarInsumo"
                                    label="Buscar Insumo"
                                    fullWidth
                                    margin="normal"
                                    value={search}
                                    onChange={searcher}
                                />
                                {errors.detalles && <FormHelperText>{errors.detalles}</FormHelperText>}
                            </FormControl>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {results.filter(insumo => insumo.eliminado === false && insumo.esParaElaborar === true)
                                            .map((insumo) => (
                                                <TableRow key={insumo.id}>
                                                    <TableCell>
                                                        <img src={insumo.imagenes.length > 0 ? insumo.imagenes[0].url : ''} alt={`Imagen de ${insumo.denominacion}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1">{insumo.denominacion}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="success" onClick={() => handleAgregar(insumo)}>Agregar</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Detalles Agregados
                            </Typography>
                            <Grid container spacing={2}>
                                {detalles.map((detalle, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body1" gutterBottom mb={2}>
                                                    {detalle.articuloInsumo.denominacion}
                                                </Typography>
                                                <TextField
                                                    type="decimal"
                                                    value={detalle.cantidad}
                                                    onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
                                                    label="Cantidad"
                                                    fullWidth
                                                    onInput={(e) => {
                                                        const input = e.target as HTMLInputElement;
                                                        input.value = input.value.replace(/[^0-9]/g, '');
                                                    }}
                                                    inputProps={{
                                                        inputMode: 'numeric',
                                                        pattern: '[0-9]*',
                                                        min: 0,
                                                    }}
                                                />
                                            </CardContent>
                                            <CardActions>
                                                <Button variant="contained" color="error" onClick={() => handleEliminar(index)} fullWidth>
                                                    Eliminar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button onClick={handlePreviousStep} color="secondary" variant="contained">
                                    Atrás
                                </Button>
                                <Button onClick={handleSubmit} color="primary" variant="contained">
                                    {currentArticuloManufacturado.id !== null && currentArticuloManufacturado.id > 0 ? "Actualizar Manufacturado" : "Crear Manufacturado"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ArticuloManufacturadoAddModal;