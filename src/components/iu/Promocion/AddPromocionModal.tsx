import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Paper, Card, CardContent, CardActions, FormControlLabel, Checkbox, MenuItem, FormControl, FormHelperText, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TipoPromocion } from '../../../types/enums/TipoPromocion';
import Promocion from '../../../types/Promocion';
import { PromocionCreate, PromocionUpdate } from '../../../services/PromocionService';
import { Delete } from "@mui/icons-material";
import Imagen from '../../../types/Imagen';
import { CloudinaryPromocionUpload, CloudinaryPromocionDelete } from '../../../services/ImagenPromocionService';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import Articulo from '../../../types/Articulo';
import { ArticuloManufacturadoFindBySucursal } from '../../../services/ArticuloManufacturadoService';
import { ArticuloInsumoGetAllParaVender } from '../../../services/ArticuloInsumoService';
import ArticuloManufacturado from '../../../types/ArticuloManufacturado';
import ArticuloInsumo from '../../../types/ArticuloInsumo';
import PromocionDetalle from '../../../types/PromocionDetalle';
import { SucursalGetByEmpresaId } from '../../../services/SucursalService';
import SucursalShortDto from '../../../types/SucursalShortDto';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingModal from '../Loading/LoadingModal';
import colorConfigs from "../../../configs/colorConfig"
import { useAppSelector } from '../../../redux/hook';

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

interface AddPromocionModalProps {
    open: boolean;
    onClose: () => void;
    currentPromocion: Promocion;
    success: () => void;
    error: () => void;
}

const AddPromocionModal: React.FC<AddPromocionModalProps> = ({ open, onClose, currentPromocion, success, error }) => {
    const [step, setStep] = useState(1);
    const [promocion, setPromocion] = useState<Promocion>(currentPromocion);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);
    const [search, setSearch] = useState("");
    const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [detalles, setDetalles] = useState<PromocionDetalle[]>([]);
    const [total, setTotal] = useState(0);
    const [sucursales, setSucursales] = useState<SucursalShortDto[]>([]);
    const [currentSucursales, setCurrentSucursales] = useState<SucursalShortDto[]>(currentPromocion.sucursales);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [accionLoading, setAccionLoading] = useState("Creando");
    const { getAccessTokenSilently } = useAuth0();

    const createPromocion = async (promocion: Promocion) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return PromocionCreate(promocion, token);
    };

    const updatePromocion = async (promocion: Promocion) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return PromocionUpdate(promocion, token);
    };

    const getAllArticuloInsumoParaVender = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (sucursalRedux) {
            const insumos: ArticuloInsumo[] = await ArticuloInsumoGetAllParaVender(sucursalRedux.id, token);
            setInsumos(insumos);
        }
    };

    const getAllArticuloManufacturadoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (sucursalRedux) {
            const manufacturados: ArticuloManufacturado[] = await ArticuloManufacturadoFindBySucursal(sucursalRedux.id, token);
            setManufacturados(manufacturados);
        }
    };

    const getAllSucursales = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (empresaRedux) {
            const sucursales: SucursalShortDto[] = await SucursalGetByEmpresaId(empresaRedux.id, token);
            setSucursales(sucursales);
        }
    }

    const searcher = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    let results: Articulo[] = [];

    if (!search) {
        results = [];
    } else {
        results = articulos.filter((articulo) =>
            articulo.denominacion.toLowerCase().includes(search.toLocaleLowerCase()));
    }

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
                    if (promocion.id !== null && promocion.id > 0) {
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

    const removeImage = (index: number) => {
        if (promocion.id !== null && promocion.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }
    };

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

    const cloudinaryUpload = async (): Promise<Imagen[]> => {
        if (files.length === 0) return [];

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
            const imagenes = await Promise.all(files.map(file => CloudinaryPromocionUpload(file, token)));
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

            await CloudinaryPromocionDelete(publicId, id.toString(), token);
        } catch (error) {
            console.error('Error deleting the file', error);
        }

    };

    useEffect(() => {
        if (promocion.id !== null && promocion.id > 0) {
            setDetalles(JSON.parse(JSON.stringify(currentPromocion.promocionDetalles)));
            setImages(promocion.imagenes.map(imagen => imagen.url));
            setArticuloImages(promocion.imagenes);
        }
    }, [currentPromocion]);

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
        getAllArticuloInsumoParaVender();
        getAllSucursales();
        if (promocion.id !== null) {
            let newTotal = 0;
            detalles.forEach(detalle => {
                if (detalle.articulo.precioVenta !== null) {
                    newTotal += detalle.articulo.precioVenta * detalle.cantidad;
                }
            });

            setTotal(newTotal);
        }
    }, [sucursalRedux, empresaRedux, total]);

    useEffect(() => {
        setArticulos([...insumos, ...manufacturados]);
    }, [insumos, manufacturados]);

    const calcularTotal = () => {
        if (promocion.id !== null) {
            let newTotal = 0;
            detalles.forEach(detalle => {
                if (detalle.articulo.precioVenta !== null) {
                    newTotal += detalle.articulo.precioVenta * detalle.cantidad;
                }
            });

            return newTotal;
        }

        return 0;
    }

    const handleSucursalChange = (id: number) => {
        const sucursalesSeleccionadas = promocion.sucursales || [];
        const sucursalExistenteIndex = sucursalesSeleccionadas.findIndex(s => s.id === id);

        if (sucursalExistenteIndex !== -1) {
            // Si la sucursal ya está seleccionada, la quitamos del array
            const updatedSucursales = [...sucursalesSeleccionadas];
            updatedSucursales.splice(sucursalExistenteIndex, 1);
            setCurrentSucursales(updatedSucursales);
            setPromocion({
                ...promocion,
                sucursales: updatedSucursales
            });
        } else {
            // Si la sucursal no está seleccionada, la añadimos al array
            const sucursal = sucursales.find(s => s.id === id);
            if (sucursal) {
                currentSucursales.push(sucursal);
                setPromocion({
                    ...promocion,
                    sucursales: [...sucursalesSeleccionadas, sucursal]
                });
            }
        }

        if (errors.sucursales) {
            setErrors({ ...errors, sucursales: '' });
        }
    };

    const handleAgregar = (articulo: Articulo) => {
        const nuevoDetalle = {
            id: null,
            eliminado: false,
            cantidad: 1,
            articulo: articulo
        };

        const existe = detalles.some(detalle => detalle.articulo.id === articulo.id);
        if (!existe) {
            setDetalles([...detalles, nuevoDetalle]);
            if (articulo.precioVenta !== null) {
                handleTotal(articulo.precioVenta, nuevoDetalle.cantidad);
            }

            setSearch("");

            setErrors(prev => ({
                ...prev,
                detalles: ''
            }));
        }
    };

    const handleCantidadChange = (index: number, nuevaCantidad: number) => {
        const nuevosDetalles = [...detalles];
        const cantidadAnterior = nuevosDetalles[index].cantidad;
        nuevosDetalles[index].cantidad = nuevaCantidad;
        const diferencia = nuevaCantidad - cantidadAnterior;
        const precioVenta = nuevosDetalles[index].articulo.precioVenta;

        if (precioVenta !== null) {
            handleTotal(precioVenta, diferencia);
        }

        setDetalles(nuevosDetalles);
    };

    const handleEliminar = (index: number) => {
        // Captura el precio y cantidad antes de filtrar el array
        const precioVenta = detalles[index].articulo.precioVenta;
        const cantidad = detalles[index].cantidad;

        // Filtra los detalles, excluyendo el elemento en 'index'
        const nuevosDetalles = detalles.filter((_, i) => i !== index);

        // Actualiza el total solo si precioVenta no es null
        if (precioVenta !== null) {
            handleTotal(precioVenta, -cantidad);
        }

        // Actualiza el estado con los nuevos detalles
        setDetalles(nuevosDetalles);
    };

    const handleTotal = (precioVenta: number, cantidad: number) => {
        setTotal(total + precioVenta * cantidad);
    }

    const handleNext = () => {
        if(step === 1 && !validateStep1()) return;
        if(step === 2 && !validateStep2()) return;
        if(step === 3 && !validateStep3()) return;
        if(step === 4 && !validateStep4()) return;
        setStep((prev) => prev + 1);
    }
    const handleBack = () => setStep((prev) => prev - 1);

    const handleClose = () => {
        setStep(1);
        setSearch("");
        setErrors({});
        setTotal(0);
        setFiles([]);
        setImages([]);
        setArticuloImages([]);
        setPromocion(currentPromocion);
        setAccionLoading("Creando");
        setCurrentSucursales(currentPromocion.sucursales);
        if (promocion.id !== null && promocion.id > 0) {
            setDetalles(JSON.parse(JSON.stringify(currentPromocion.promocionDetalles)));
        } else {
            setDetalles([]);
            setPromocion({
                ...currentPromocion,
                sucursales: []
            });
        }

        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const maxLength: Record<string, number> = {
            denominacion: 25,
            descripcionDescuento: 200,
            precioPromocional: 6
        };

        if (value.length > maxLength[name]) {
            return;
        }

        setPromocion({ ...promocion, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!promocion.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!promocion.tipoPromocion) {
            newErrors.tipoPromocion = 'El tipo de la promoción es obligatorio.';
        }
        if (!promocion.fechaDesde) {
            newErrors.fechaDesde = 'La fecha desde es obligatoria.';
        }
        if (!promocion.fechaHasta) {
            newErrors.fechaHasta = 'La fecha hasta es obligatoria.';
        }
        if (!promocion.horaDesde) {
            newErrors.horaDesde = 'La hora desde es obligatoria.';
        }
        if (!promocion.horaHasta) {
            newErrors.horaHasta = 'La hora hasta es obligatoria.';
        }
        if (!promocion.descripcionDescuento) {
            newErrors.descripcionDescuento = 'La descripción es obligatoria.';
        }
        if (files.length === 0 && promocion.imagenes.length === 0) {
            newErrors.files = 'Las imagenes son obligatorias.';
        }
        if (detalles.length === 0) {
            newErrors.detalles = 'Los detalles son obligatorios.';
        }
        if (!promocion.precioPromocional) {
            newErrors.precioPromocional = 'El precio promocional es obligatorio.';
        }
        if (!promocion.sucursales || promocion.sucursales.length === 0) {
            newErrors.sucursales = 'Debe seleccionar al menos una sucursal.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!promocion.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!promocion.tipoPromocion) {
            newErrors.tipoPromocion = 'El tipo de la promoción es obligatorio.';
        }
        if (!promocion.fechaDesde) {
            newErrors.fechaDesde = 'La fecha desde es obligatoria.';
        }
        if (!promocion.fechaHasta) {
            newErrors.fechaHasta = 'La fecha hasta es obligatoria.';
        }
        if (!promocion.horaDesde) {
            newErrors.horaDesde = 'La hora desde es obligatoria.';
        }
        if (!promocion.horaHasta) {
            newErrors.horaHasta = 'La hora hasta es obligatoria.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!promocion.descripcionDescuento) {
            newErrors.descripcionDescuento = 'La descripción es obligatoria.';
        }
        if (files.length === 0 && promocion.imagenes.length === 0) {
            newErrors.files = 'Las imagenes son obligatorias.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (detalles.length === 0) {
            newErrors.detalles = 'Los detalles son obligatorios.';
        }
        if (!promocion.precioPromocional) {
            newErrors.precioPromocional = 'El precio promocional es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep4 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!promocion.sucursales || promocion.sucursales.length === 0) {
            newErrors.sucursales = 'Debe seleccionar al menos una sucursal.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }
        const imagenes = await cloudinaryUpload();

        setLoading(true);

        if (imagenes && imagenes?.length > 0) {
            imagenes.forEach(imagen => {
                articuloImages.push(imagen);
            });
        }

        if (articuloImages !== null) {
            promocion.imagenes = articuloImages;
        }

        promocion.promocionDetalles = detalles;
        promocion.sucursales = currentSucursales;


        if (promocion.id !== null && promocion.id > 0) {
            try {
                const data = await updatePromocion(promocion);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            } finally {
                setLoading(false);
            }

        } else {
            try {
                const data = await createPromocion(promocion);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar un articulo manufacturado.");
            } finally {
                setLoading(false);
            }
        }

        success();
        handleClose();
    }

    return (
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
                {promocion.id !== null && promocion.id > 0 ?
                    <Typography variant="h6" gutterBottom>
                        Actualizar Promoción
                    </Typography>
                    :
                    <Typography variant="h6" gutterBottom>
                        Agregar Promoción
                    </Typography>
                }

                {step === 1 && (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <FormControl fullWidth error={!!errors.denominacion}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="denominacion"
                                        value={promocion.denominacion}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    {errors.denominacion && <FormHelperText>{errors.denominacion}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth error={!!errors.tipoPromocion}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Tipo de Promoción"
                                        name="tipoPromocion"
                                        value={promocion.tipoPromocion}
                                        onChange={handleChange}
                                        margin="normal"
                                    >
                                        <MenuItem key={1} value={TipoPromocion.HAPPY_HOUR}>Happy Hour</MenuItem>
                                        <MenuItem key={2} value={TipoPromocion.PROMOCION}>Promoción</MenuItem>
                                    </TextField>
                                    {errors.tipoPromocion && <FormHelperText>{errors.tipoPromocion}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.fechaDesde}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Desde"
                                        type="date"
                                        name="fechaDesde"
                                        value={promocion.fechaDesde}
                                        onChange={handleChange}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {errors.fechaDesde && <FormHelperText>{errors.fechaDesde}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.fechaHasta}>
                                    <TextField
                                        fullWidth
                                        label="Fecha Hasta"
                                        type="date"
                                        name="fechaHasta"
                                        value={promocion.fechaHasta}
                                        onChange={handleChange}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {errors.fechaHasta && <FormHelperText>{errors.fechaHasta}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.horaDesde}>
                                    <TextField
                                        fullWidth
                                        label="Hora Desde"
                                        type="time"
                                        name="horaDesde"
                                        value={promocion.horaDesde}
                                        onChange={handleChange}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {errors.horaDesde && <FormHelperText>{errors.horaDesde}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth error={!!errors.horaHasta}>
                                    <TextField
                                        fullWidth
                                        label="Hora Hasta"
                                        type="time"
                                        name="horaHasta"
                                        value={promocion.horaHasta}
                                        onChange={handleChange}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {errors.horaHasta && <FormHelperText>{errors.horaHasta}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button disabled onClick={handleBack} variant="contained" sx={{ ...colorConfigs.backButtonStyles }}>
                                Atrás
                            </Button>
                            <Button onClick={handleNext} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 2 && (
                    <>
                        <FormControl fullWidth error={!!errors.descripcionDescuento}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                name="descripcionDescuento"
                                value={promocion.descripcionDescuento}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            {errors.descripcionDescuento && <FormHelperText>{errors.descripcionDescuento}</FormHelperText>}
                        </FormControl>
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
                            {promocion.id !== null && promocion.id > 0 ?
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
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" onClick={handleBack} sx={{ ...colorConfigs.backButtonStyles }}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={handleNext} sx={{ ...colorConfigs.buttonStyles }}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 3 && (
                    <>
                        <FormControl fullWidth error={!!errors.detalles}>
                            <TextField
                                fullWidth
                                label="Buscar Artículos"
                                name="buscarArticulos"
                                value={search}
                                onChange={searcher}
                                margin="normal"
                            />
                            {errors.detalles && <FormHelperText>{errors.detalles}</FormHelperText>}
                        </FormControl>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {results.filter(articulo => articulo.habilitado === true)
                                        .map((articulo) => (
                                            <TableRow key={articulo.id}>
                                                <TableCell>
                                                    <img src={articulo.imagenes.length > 0 ? articulo.imagenes[0].url : ''} alt={`Imagen de ${articulo.denominacion}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1">{articulo.denominacion}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {Boolean(detalles.find(detalle => detalle.articulo.id === articulo.id)) ? (
                                                        <Tooltip title="Articulo ya agregado" arrow>
                                                            <span>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    disabled={true}
                                                                    onClick={() => handleAgregar(articulo)}
                                                                >
                                                                    Agregar
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            disabled={false}
                                                            onClick={() => handleAgregar(articulo)}
                                                        >
                                                            Agregar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="body1" gutterBottom sx={{ mt: 3 }}>
                            Precio neto: ${promocion.id !== null ? (
                                calcularTotal()
                            ) : (
                                total
                            )}
                        </Typography>
                        <Box>
                            <FormControl fullWidth error={!!errors.precioPromocional}>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Precio Promocional"
                                        type='decimal'
                                        name="precioPromocional"
                                        value={promocion.precioPromocional}
                                        onChange={handleChange}
                                        margin="normal"
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
                                </Grid>
                                {errors.precioPromocional && <FormHelperText>{errors.precioPromocional}</FormHelperText>}
                            </FormControl>
                        </Box>
                        <Box mb={4}>
                            <Typography variant="body1" gutterBottom sx={{ mt: 3 }}>
                                Detalles de la Promoción
                            </Typography>
                            <Grid container spacing={2}>
                                {detalles.map((detalle, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="body1" gutterBottom mb={2}>
                                                    {detalle.articulo.denominacion}
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
                                                        min: 0
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
                        </Box>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" onClick={handleBack} sx={{ ...colorConfigs.backButtonStyles }}>
                                Atrás
                            </Button>
                            <Button variant="contained" onClick={handleNext} sx={{ ...colorConfigs.buttonStyles }}>
                                Siguiente
                            </Button>
                        </Box>
                    </>
                )}
                {step === 4 && (
                    <>
                        <Typography variant="body1" gutterBottom sx={{ mt: 3 }}>
                            Seleccione la/s sucursales:
                        </Typography>
                        <Box mb={3}>
                            <FormControl fullWidth error={!!errors.sucursales}>
                                {sucursales.map(sucursal => (
                                    <FormControlLabel
                                        key={sucursal.id}
                                        control={
                                            <Checkbox
                                                checked={promocion.sucursales?.some(s => s.id === sucursal.id) || false}
                                                onChange={() => handleSucursalChange(sucursal.id)}
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: "#233044"
                                                    }
                                                }}
                                            />
                                        }
                                        label={sucursal.nombre}
                                    />
                                ))}
                                {errors.sucursales && <FormHelperText>{errors.sucursales}</FormHelperText>}
                            </FormControl>
                        </Box>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button variant="contained" onClick={handleBack} sx={{ ...colorConfigs.backButtonStyles }}>
                                Atrás
                            </Button>
                            {promocion.id !== null && promocion.id > 0 ?
                                <Button variant="contained" onClick={() => { handleSubmit(); }} sx={{ ...colorConfigs.buttonStyles }}>
                                    Actualizar Promoción
                                </Button>
                                :
                                <Button variant="contained" onClick={() => { handleSubmit(); }} sx={{ ...colorConfigs.buttonStyles }}>
                                    Crear Promoción
                                </Button>
                            }
                            <LoadingModal open={loading} msj={"Manufacturado"} accion={accionLoading} />
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default AddPromocionModal;