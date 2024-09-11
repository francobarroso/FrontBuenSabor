import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, Modal, Switch, TextField, Tooltip, Typography } from "@mui/material";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import { useEffect, useState } from "react";
import Imagen from "../../../types/Imagen";
import { useAuth0 } from "@auth0/auth0-react";
import { CategoriaByEmpresaGetAll } from "../../../services/CategoriaService";
import Categoria from "../../../types/Categoria";
import UnidadMedida from "../../../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../../../services/UnidadMedidaService";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { Delete } from "@mui/icons-material";
import { CloudinaryDelete, CloudinaryUpload } from "../../../services/CloudinaryService";
import { ArticuloInsumoCreate, ArticuloInsumoUpdate } from "../../../services/ArticuloInsumoService";
import CloseIcon from '@mui/icons-material/Close';
import LoadingModal from "../Loading/LoadingModal";
import colorConfigs from "../../../configs/colorConfig"
import { useAppSelector } from "../../../redux/hook";


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
    articulo: ArticuloInsumo;
    imagenes: string[];
    articuloImagenes: Imagen[];
    success: () => void;
    error: () => void;
}

const ArticuloInsumoAddModal: React.FC<ArticuloInsumoAddModalProps> = ({ open, onClose, articulo, imagenes, articuloImagenes, success, error }) => {
    const [currentArticuloInsumo, setCurrentArticuloInsumo] = useState<ArticuloInsumo>(articulo);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>(imagenes);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articuloImagenes);
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [modalStep, setModalStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [accionLoading, setAccionLoading] = useState("Creando");
    const { getAccessTokenSilently } = useAuth0();

    const createArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return ArticuloInsumoCreate(articuloInsumo, token);
    };

    const updateArticuloInsumo = async (articuloInsumo: ArticuloInsumo) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return ArticuloInsumoUpdate(articuloInsumo, token);
    };

    const getAllCategoriaByEmpresa = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (empresaRedux) {
            const categorias: Categoria[] = await CategoriaByEmpresaGetAll(empresaRedux.id, token);
            setCategorias(categorias);
        }
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
                    if (currentArticuloInsumo.id > 0) {
                        setArticuloImages(prevImages => [...prevImages, { id: 0, eliminado: false, url: newImage }]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
        const name = 'files';
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
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
            setImages(imagenes);
            setArticuloImages(articuloImagenes);
        }
    }, [open, imagenes, articuloImagenes]);

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
        if (currentArticuloInsumo.id > 0) {
            setArticuloImages(articuloImages.filter(img => img.id !== index));
        } else {
            setImages(prevImages => prevImages.filter((_, i) => i !== index));
        }

    };

    const handleNextStep = () => {
        if(modalStep === 1 && !validateStep1()) return;
        if(modalStep === 2 && !validateStep2()) return;
        
        setModalStep(modalStep + 1);
    };

    const handlePreviousStep = () => {
        setModalStep(modalStep - 1);
    };


    type CustomChangeEvent = {
        target: {
            name: string;
            value: unknown;
        };
    };

    const handleSelectChange = (e: CustomChangeEvent, name: string) => {
        const value = e.target.value as number; // Asumiendo que el valor es un número (id)

        if (name === 'unidadMedida') {
            const unidadMedidaSeleccionada = unidadMedidas.find(u => u.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                unidadMedida: unidadMedidaSeleccionada || emptyUnidadMedida
            }));
        } else if (name === 'categoria') {
            const categoriaSeleccionada = categorias.find(c => c.id === value);
            setCurrentArticuloInsumo(prevState => ({
                ...prevState,
                categoria: categoriaSeleccionada || emptyCategoria
            }));
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const maxLength: Record<string, number> = {
            denominacion: 25,
            precioCompra: 6,
            precioVenta: 6,
            stockActual: 4,
            stockMinimo: 4,
            stockMaximo: 4
        };

        if (value.length > maxLength[name]) {
            return;
        }

        setCurrentArticuloInsumo(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentArticuloInsumo(prevState => ({
            ...prevState,
            esParaElaborar: e.target.checked,
            precioVenta: e.target.checked ? 0 : prevState.precioVenta
        }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentArticuloInsumo.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!currentArticuloInsumo.unidadMedida.id) {
            newErrors.unidadMedida = 'La unidad de medida es obligatoria.';
        }
        if (!currentArticuloInsumo.categoria.id) {
            newErrors.categoria = 'La categoria es obligatoria.';
        }
        if (files.length === 0 && currentArticuloInsumo.imagenes.length === 0) {
            newErrors.files = 'Las imagenes son obligatorias.';
        }
        if (!currentArticuloInsumo.precioCompra) {
            newErrors.precioCompra = 'El precio de compra es obligatorio.';
        }
        if (!currentArticuloInsumo.precioVenta && !currentArticuloInsumo.esParaElaborar) {
            newErrors.precioVenta = 'El precio de venta es obligatorio.';
        }
        if (!currentArticuloInsumo.stockActual) {
            newErrors.stockActual = 'El stock actual es obligatorio.';
        }
        if (!currentArticuloInsumo.stockMinimo) {
            newErrors.stockMinimo = 'El stock minimo es obligatorio.';
        }
        if (!currentArticuloInsumo.stockMaximo) {
            newErrors.stockMaximo = 'El stock maximo es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentArticuloInsumo.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!currentArticuloInsumo.unidadMedida.id) {
            newErrors.unidadMedida = 'La unidad de medida es obligatoria.';
        }
        if (!currentArticuloInsumo.categoria.id) {
            newErrors.categoria = 'La categoria es obligatoria.';
        }
        if (files.length === 0 && currentArticuloInsumo.imagenes.length === 0) {
            newErrors.files = 'Las imagenes son obligatorias.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentArticuloInsumo.precioCompra) {
            newErrors.precioCompra = 'El precio de compra es obligatorio.';
        }
        if (!currentArticuloInsumo.precioVenta && !currentArticuloInsumo.esParaElaborar) {
            newErrors.precioVenta = 'El precio de venta es obligatorio.';
        }
        if (!currentArticuloInsumo.stockActual) {
            newErrors.stockActual = 'El stock actual es obligatorio.';
        }
        if (!currentArticuloInsumo.stockMinimo) {
            newErrors.stockMinimo = 'El stock minimo es obligatorio.';
        }
        if (!currentArticuloInsumo.stockMaximo) {
            newErrors.stockMaximo = 'El stock maximo es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setModalStep(1);
        setErrors({});
        setCurrentArticuloInsumo(articulo);
        setFiles([]);
        setImages(imagenes);
        setArticuloImages(articuloImagenes);
        setAccionLoading("Creando");
        onClose();
    }

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
            currentArticuloInsumo.imagenes = articuloImages;
        }

        if (currentArticuloInsumo.id > 0) {

            try {
                const data = await updateArticuloInsumo(currentArticuloInsumo);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar un articulo insumo");
            } finally {
                setLoading(false);
            }

        } else {

            try {

                const data = await createArticuloInsumo(currentArticuloInsumo);
                if (data.status !== 200) {
                    deleteImages(imagenes);
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al crear un articulo insumo");
            } finally {
                setLoading(false);
            }

        }

        success();
        handleClose();
    };

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
                        {currentArticuloInsumo.id === 0 ? 'Crear Articulo Insumo' : 'Actualizar Articulo Insumo'}
                    </Typography>
                    {
                        modalStep === 1 && (
                            <>
                                <Box mb={1}>
                                    <FormControl fullWidth error={!!errors.denominacion}>
                                        <TextField
                                            label="Denominación"
                                            name="denominacion"
                                            fullWidth
                                            margin="normal"
                                            value={currentArticuloInsumo.denominacion}
                                            onChange={handleInputChange}
                                        />
                                        {errors.denominacion && <FormHelperText>{errors.denominacion}</FormHelperText>}
                                    </FormControl>
                                </Box>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                        <FormControl fullWidth error={!!errors.unidadMedida}>
                                            <Autocomplete
                                                options={unidadMedidas.filter(unidad => !unidad.eliminado)}
                                                getOptionLabel={(option) => option.denominacion}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Unidad de Medida"
                                                        margin="normal"
                                                        fullWidth
                                                        style={{ flex: 1, marginRight: 8 }}
                                                    />
                                                )}
                                                value={currentArticuloInsumo.unidadMedida || null}
                                                onChange={(_, newValue) => handleSelectChange({ target: { name: 'unidadMedidaId', value: newValue?.id || '' } }, 'unidadMedida')}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                            />
                                            {errors.unidadMedida && <FormHelperText>{errors.unidadMedida}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={currentArticuloInsumo.esParaElaborar}
                                                    onChange={handleSwitchChange}
                                                    name="esParaElaborar"
                                                />
                                            }
                                            label="¿Es para elaborar?"
                                            style={{ marginRight: 'auto', marginLeft: 'auto' }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth error={!!errors.categoria}>
                                            <Autocomplete
                                                options={categorias.filter(categoria => categoria.esInsumo && !categoria.eliminado)}
                                                getOptionLabel={(option) => option.denominacion}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Categoria"
                                                        margin="normal"
                                                        fullWidth
                                                        style={{ marginRight: 'auto', marginLeft: 'auto' }}
                                                    />
                                                )}
                                                value={currentArticuloInsumo.categoria || null}
                                                onChange={(_, newValue) => handleSelectChange({ target: { name: 'categoriaId', value: newValue?.id || '' } }, 'categoria')}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                            />
                                            {errors.categoria && <FormHelperText>{errors.categoria}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>

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

                                    {currentArticuloInsumo.id > 0 ?
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
                                    <Button disabled onClick={handlePreviousStep} variant="contained" sx={{ ...colorConfigs.backButtonStyles }}>
                                        Atrás
                                    </Button>
                                    <Button onClick={handleNextStep} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>
                                        Siguiente
                                    </Button>
                                </Box>
                            </>
                        )
                    }
                    {
                        modalStep === 2 && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth error={!!errors.precioCompra}>
                                            <TextField
                                                label="Precio de Compra"
                                                name="precioCompra"
                                                type="decimal"
                                                fullWidth
                                                margin="normal"
                                                value={currentArticuloInsumo.precioCompra}
                                                onChange={handleInputChange}
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
                                            {errors.precioCompra && <FormHelperText>{errors.precioCompra}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {currentArticuloInsumo.esParaElaborar ?
                                            <Tooltip title="Insumo que es para elborar no se debe vender." arrow>
                                                <FormControl fullWidth error={!!errors.precioVenta}>
                                                    <TextField
                                                        label="Precio de Venta"
                                                        name="precioVenta"
                                                        type="decimal"
                                                        disabled={currentArticuloInsumo.esParaElaborar}
                                                        fullWidth
                                                        margin="normal"
                                                        value={currentArticuloInsumo.precioVenta}
                                                        onChange={handleInputChange}
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
                                                    {errors.precioVenta && !currentArticuloInsumo.esParaElaborar && <FormHelperText>{errors.precioVenta}</FormHelperText>}
                                                </FormControl>
                                            </Tooltip>
                                            :
                                            <FormControl fullWidth error={!!errors.precioVenta}>
                                                <TextField
                                                    label="Precio de Venta"
                                                    name="precioVenta"
                                                    type="decimal"
                                                    disabled={currentArticuloInsumo.esParaElaborar}
                                                    fullWidth
                                                    margin="normal"
                                                    value={currentArticuloInsumo.precioVenta}
                                                    onChange={handleInputChange}
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
                                                {errors.precioVenta && !currentArticuloInsumo.esParaElaborar && <FormHelperText>{errors.precioVenta}</FormHelperText>}
                                            </FormControl>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mb={2}>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth error={!!errors.stockActual}>
                                            <TextField
                                                label="Stock Actual"
                                                name="stockActual"
                                                type="decimal"
                                                fullWidth
                                                margin="normal"
                                                value={currentArticuloInsumo.stockActual}
                                                onChange={handleInputChange}
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
                                            {errors.stockActual && <FormHelperText>{errors.stockActual}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth error={!!errors.stockMinimo}>
                                            <TextField
                                                label="Stock Minimo"
                                                name="stockMinimo"
                                                fullWidth
                                                margin="normal"
                                                type="decimal"
                                                value={currentArticuloInsumo.stockMinimo}
                                                onChange={handleInputChange}
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
                                            {errors.stockMinimo && <FormHelperText>{errors.stockMinimo}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth error={!!errors.stockMaximo}>
                                            <TextField
                                                label="Stock Maximo"
                                                name="stockMaximo"
                                                type="decimal"
                                                fullWidth
                                                margin="normal"
                                                value={currentArticuloInsumo.stockMaximo}
                                                onChange={handleInputChange}
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
                                            {errors.stockMaximo && <FormHelperText>{errors.stockMaximo}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button onClick={handlePreviousStep} variant="contained" sx={{ ...colorConfigs.backButtonStyles }}>
                                        Atrás
                                    </Button>
                                    <Button onClick={handleSubmit} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>
                                        {currentArticuloInsumo.id !== null && currentArticuloInsumo.id > 0 ? "Actualizar Insumo" : "Crear Insumo"}
                                    </Button>
                                    <LoadingModal open={loading} msj={"Insumo"} accion={accionLoading} />
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Modal>
        </>
    );
};

export default ArticuloInsumoAddModal;