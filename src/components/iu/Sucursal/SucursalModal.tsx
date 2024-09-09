import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, Modal, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from "@auth0/auth0-react";
import Sucursal from "../../../types/Sucursal";
import { SucursalCreate, SucursalUpdate } from "../../../services/SucursalService";
import Provincia from "../../../types/Provincia";
import Localidad from "../../../types/Localidad";
import { ProvinciaGetAll } from "../../../services/ProvinciaService";
import { LocalidadGetAllByProvincia } from "../../../services/LocalidadService";
import { PaisGetAll } from "../../../services/PaisService";
import Pais from "../../../types/Pais";
import { EmpresaGetById } from "../../../services/EmpresaService";
import Empresa from "../../../types/Empresa";
import { useAppSelector } from "../../../redux/hook";
import colorConfigs from "../../../configs/colorConfig";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto' as 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface EmpresaCardProps {
    open: boolean;
    onClose: () => void;
    sucursal: Sucursal;
    success: () => void;
    error: () => void;
    hasCasaMatriz: boolean;
}

const SucursalModal: React.FC<EmpresaCardProps> = ({ open, onClose, sucursal, success, error, hasCasaMatriz }) => {
    const [currentSucursal, setCurrentSucursal] = useState<Sucursal>(sucursal);
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>();
    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [selectedPais, setSelectedPais] = useState<number | null>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);
    const [estado, setEstado] = useState(currentSucursal.esCasaMatriz);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);

    const { getAccessTokenSilently } = useAuth0();

    const createSucursal = async (sucursal: Sucursal) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return SucursalCreate(sucursal, token);
    };

    const updateSucursal = async (sucursal: Sucursal) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return SucursalUpdate(sucursal, token);
    };

    const getAllProvincias = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const provincias: Provincia[] = await ProvinciaGetAll(token);
        setProvincias(provincias);
    }

    const getLocalidadesByProvincias = async (id: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const localidades: Localidad[] = await LocalidadGetAllByProvincia(id, token);
        return localidades;
    }

    const getAllPaises = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const paises: Pais[] = await PaisGetAll(token);
        setPaises(paises);
    }

    const getEmpresaById = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (empresaRedux) {
            const empresa: Empresa = await EmpresaGetById(empresaRedux.id, token);
            setCurrentEmpresa(empresa);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAllProvincias();
            await getAllPaises();
            if (sucursal.id > 0) {
                if (sucursal.domicilio.localidad) {
                    setSelectedPais(sucursal.domicilio.localidad.provincia.pais.id);
                    setSelectedProvincia(sucursal.domicilio.localidad.provincia.id);
                    const localidades: Localidad[] = await getLocalidadesByProvincias(sucursal.domicilio.localidad.provincia.id);
                    setLocalidades(localidades);
                    setSelectedLocalidad(sucursal.domicilio.localidad.id);
                }
            } else {
                await getEmpresaById();
                setSelectedProvincia(null);
                setSelectedLocalidad(null);
            }
        };

        fetchData();
    }, []);

    type CustomChangeEvent = {
        target: {
            value: unknown;
        };
    };

    const handlePaisChange = async (e: CustomChangeEvent) => {
        const paisId = e.target.value as number;
        setSelectedPais(paisId);
        setSelectedProvincia(null);
        setSelectedLocalidad(null);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad: null }
        }));

        if (errors.pais) {
            setErrors(prev => ({
                ...prev,
                pais: ''
            }));
            setErrors(prev => ({
                ...prev,
                provincia: ''
            }));
            setErrors(prev => ({
                ...prev,
                localidad: ''
            }));
        }
    };

    const handleProvinciaChange = async (e: CustomChangeEvent) => {
        const provinciaId = e.target.value as number;
        setSelectedProvincia(provinciaId);
        setSelectedLocalidad(null);
        const localidades: Localidad[] = await getLocalidadesByProvincias(provinciaId);
        setLocalidades(localidades);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad: null }
        }));

        if (errors.provincia) {
            setErrors(prev => ({
                ...prev,
                provincia: ''
            }));
            setErrors(prev => ({
                ...prev,
                localidad: ''
            }));
        }
    };

    const handleLocalidadChange = (e: CustomChangeEvent) => {
        const localidadId = e.target.value as number;
        const localidad = localidades.find(l => l.id === localidadId) || null;
        setSelectedLocalidad(localidadId);
        setCurrentSucursal(prev => ({
            ...prev,
            domicilio: { ...prev.domicilio, localidad }
        }));
        if (errors.localidad) {
            setErrors(prev => ({
                ...prev,
                localidad: ''
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCurrentSucursal(prev => ({ ...prev, [name]: checked }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericFields = ["numero", "cp", "piso", "nroDpto"];
        const maxLength: Record<string, number> = {
            nombre: 25,
            calle: 25,
            numero: 5,
            cp: 5,
            piso: 3,
            nroDpto: 3
        };

        if (value.length > maxLength[name]) {
            return;
        }

        if (numericFields.includes(name) && !/^[0-9]*$/.test(value)) {
            return;
        }

        if (name in currentSucursal.domicilio) {
            setCurrentSucursal(prev => ({
                ...prev,
                domicilio: { ...prev.domicilio, [name]: value }
            }));
        } else {
            setCurrentSucursal(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentSucursal.nombre) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (!currentSucursal.horarioApertura) {
            newErrors.horarioApertura = 'La hora de apertura es obligatoria.';
        }
        if (!currentSucursal.horarioCierre) {
            newErrors.horarioCierre = 'La hora de cierre es obligatoria.';
        }
        if (!currentSucursal.domicilio.calle) {
            newErrors.calle = 'La calle es obligatoria.';
        }
        if (!currentSucursal.domicilio.numero) {
            newErrors.numero = 'El número es obligatorio.';
        }
        if (!currentSucursal.domicilio.cp) {
            newErrors.cp = 'El codigo postal es obligatorio.';
        }
        if (!selectedPais) {
            newErrors.pais = 'El país es obligatorio.';
        }
        if (!selectedProvincia) {
            newErrors.provincia = 'La provincia es obligatoria.';
        }
        if (!selectedLocalidad) {
            newErrors.localidad = 'La localidad es obligatoria.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setCurrentSucursal(sucursal);
        setEstado(sucursal.esCasaMatriz);
        if (sucursal.id <= 0) {
            setSelectedPais(null);
            setSelectedLocalidad(null);
            setSelectedProvincia(null);
        }
        setErrors({});
        onClose();
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        if (currentSucursal.id > 0) {
            try {
                const data = await updateSucursal(currentSucursal);
                if (data.status !== 200) {
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al actualizar la sucursal.");
            }
        } else {
            try {
                currentSucursal.empresa = currentEmpresa ?? null;
                const data = await createSucursal(currentSucursal);
                if (data.status !== 200) {
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al crear la sucursal.");
            }
        }

        success();
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
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
                <Typography variant="h6" gutterBottom mb={2}>
                    {currentSucursal.id > 0 ? 'Actualizar Sucursal' : 'Crear Sucursal'}
                </Typography>
                <Box mb={2}>
                    <FormControl fullWidth error={!!errors.nombre}>
                        <TextField
                            margin="dense"
                            label="Nombre"
                            name="nombre"
                            fullWidth
                            value={currentSucursal.nombre}
                            onChange={handleChange}
                        />
                        {errors.nombre && <FormHelperText>{errors.nombre}</FormHelperText>}
                    </FormControl>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={!!errors.horarioApertura}>
                                <TextField
                                    margin="normal"
                                    label="Horario Apertura"
                                    type="time"
                                    name="horarioApertura"
                                    fullWidth
                                    value={currentSucursal.horarioApertura}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {errors.horarioApertura && <FormHelperText>{errors.horarioApertura}</FormHelperText>}
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={!!errors.horarioCierre}>
                                <TextField
                                    margin="normal"
                                    label="Horario de Cierre"
                                    name="horarioCierre"
                                    type="time"
                                    fullWidth
                                    value={currentSucursal.horarioCierre}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {errors.horarioCierre && <FormHelperText>{errors.horarioCierre}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={!!errors.calle}>
                                <TextField
                                    margin="dense"
                                    label="Calle"
                                    name="calle"
                                    fullWidth
                                    value={currentSucursal.domicilio.calle}
                                    onChange={handleChange}
                                    disabled={!!currentSucursal.id}
                                />
                                {errors.calle && <FormHelperText>{errors.calle}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth error={!!errors.numero}>
                                <TextField
                                    margin="dense"
                                    label="Número"
                                    type="decimal"
                                    name="numero"
                                    fullWidth
                                    value={currentSucursal.domicilio.numero}
                                    onChange={handleChange}
                                    disabled={!!currentSucursal.id}
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
                                {errors.numero && <FormHelperText>{errors.numero}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth error={!!errors.cp}>
                                <TextField
                                    margin="dense"
                                    label="Código Postal (CP)"
                                    name="cp"
                                    type="decimal"
                                    fullWidth
                                    value={currentSucursal.domicilio.cp}
                                    onChange={handleChange}
                                    disabled={!!currentSucursal.id}
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
                                {errors.cp && <FormHelperText>{errors.cp}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Piso"
                                name="piso"
                                type="decimal"
                                fullWidth
                                value={currentSucursal.domicilio.piso}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
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
                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                label="Número de Departamento"
                                name="nroDpto"
                                type="decimal"
                                fullWidth
                                value={currentSucursal.domicilio.nroDpto}
                                onChange={handleChange}
                                disabled={!!currentSucursal.id}
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
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Tooltip title="Solo es posible tener una casa matriz" arrow>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={currentSucursal.esCasaMatriz}
                                            onChange={handleCheckboxChange}
                                            name="esCasaMatriz"
                                            disabled={hasCasaMatriz && !estado}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#233044"
                                                }
                                            }}
                                        />
                                    }
                                    label="Casa Matriz"
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormControl fullWidth error={!!errors.pais}>
                                <Autocomplete
                                    options={paises}
                                    getOptionLabel={(option) => option.nombre}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Seleccione un País"
                                            margin="normal"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.pais}
                                            helperText={errors.pais || ''}
                                        />
                                    )}
                                    value={paises.find(pais => pais.id === selectedPais) || null}
                                    onChange={(_, newValue) => handlePaisChange({ target: { value: newValue?.id || 0 } })}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    disabled={!!currentSucursal.id}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth error={!!errors.provincia}>
                                <Autocomplete
                                    options={provincias}
                                    getOptionLabel={(option) => option.nombre}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Seleccione una Provincia"
                                            margin="normal"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.provincia}
                                            helperText={errors.provincia || ''}
                                        />
                                    )}
                                    value={provincias.find(provincia => provincia.id === selectedProvincia) || null}
                                    onChange={(_, newValue) => handleProvinciaChange({ target: { value: newValue?.id || 0 } })}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    disabled={!selectedPais || !!currentSucursal.id}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth error={!!errors.localidad}>
                            <Autocomplete
                                    options={localidades}
                                    getOptionLabel={(option) => option.nombre}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Seleccione una Localidad"
                                            margin="normal"
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.localidad}
                                            helperText={errors.localidad || ''}
                                        />
                                    )}
                                    value={localidades.find(localidad => localidad.id === selectedLocalidad) || null}
                                    onChange={(_, newValue) => handleLocalidadChange({ target: { value: newValue?.id || 0 } })}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    disabled={!selectedProvincia || !!currentSucursal.id}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={handleSave} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>{sucursal.id > 0 ? 'Actualizar' : 'Crear'}</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SucursalModal;