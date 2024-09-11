import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, IconButton, Modal, Box, Typography, Grid, FormControl, FormHelperText } from '@mui/material';
import Empleado from "../../../types/Empleado";
import { Rol } from '../../../types/enums/Rol';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from '@auth0/auth0-react';
import { EmpleadoCreate, EmpleadoUpdate } from '../../../services/EmpleadoService';
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

interface EmpleadoTableProps {
    open: boolean;
    onClose: () => void;
    empleado: Empleado;
    success: () => void;
    error: () => void;
}

const EmpleadoAddModal: React.FC<EmpleadoTableProps> = ({ open, onClose, empleado, success, error }) => {
    const [step, setStep] = useState(1);
    const [currentEmpleado, setCurrentEmpleado] = useState<Empleado>(empleado);
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { getAccessTokenSilently } = useAuth0();

    const createEmpleado = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return await EmpleadoCreate(currentEmpleado, token);
    }

    const updateEmpleado = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return await EmpleadoUpdate(currentEmpleado, token);
    }

    useEffect(() => {
        setCurrentEmpleado(empleado);
    }, [empleado]);

    const handleNext = () => {
        if(!validateStep1()) return;

        setStep(2);
    }

    const handleBack = () => {
        if(!validateStep2()) return;

        setStep(1);
    }

    const handleClose = () => {
        onClose();
        setErrors({});
        setStep(1);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const maxLength: Record<string, number> = {
            nombre: 15,
            apellido: 15,
            telefono: 15
        };

        if (value.length > maxLength[name]) {
            return;
        }
        setCurrentEmpleado(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleUsuarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const maxLength: Record<string, number> = {
            email: 50,
            userName: 10,
        };

        if (value.length > maxLength[name]) {
            return;
        }

        setCurrentEmpleado(prevState => ({
            ...prevState,
            usuario: {
                ...prevState.usuario,
                [name]: value,
            },
        }));

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentEmpleado.nombre) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }
        if (!currentEmpleado.apellido) {
            newErrors.apellido = 'El apellido es obligatorio.';
        }
        if (!currentEmpleado.telefono) {
            newErrors.telefono = 'El telefono es obligatorio.';
        }
        if (!currentEmpleado.fechaNacimiento) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
        }
        if (!currentEmpleado.usuario.email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!currentEmpleado.usuario.email.includes('@' && '.')) {
            newErrors.email = 'El email tiene un formato incorrecto.';
        }
        if (!currentEmpleado.usuario.rol) {
            newErrors.rol = 'El rol es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep1 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentEmpleado.nombre) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }
        if (!currentEmpleado.apellido) {
            newErrors.apellido = 'El apellido es obligatorio.';
        }
        if (!currentEmpleado.telefono) {
            newErrors.telefono = 'El telefono es obligatorio.';
        }
        if (!currentEmpleado.fechaNacimiento) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentEmpleado.usuario.email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!currentEmpleado.usuario.email.includes('@' && '.')) {
            newErrors.email = 'El email tiene un formato incorrecto.';
        }
        if (!currentEmpleado.usuario.rol) {
            newErrors.rol = 'El rol es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        if (currentEmpleado.sucursal !== null && sucursalRedux) {
            currentEmpleado.sucursal.id = sucursalRedux.id;
        }
        if (currentEmpleado.id !== null && currentEmpleado.id > 0) {
            try {
                const data = await updateEmpleado();
                if (data.status !== 200) {
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al actualizar un empleado.");
            }
        } else {
            try {
                const data = await createEmpleado();
                if (data.status !== 200) {
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al crear un empleado.");
            }
        }

        success();
        handleClose();
    }

    return (
        <>
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
                    {empleado.id !== null && empleado.id > 0 ?
                        <Typography variant="h6" gutterBottom>
                            Actualizar Empleado
                        </Typography>
                        :
                        <Typography variant="h6" gutterBottom>
                            Agregar Empleado
                        </Typography>
                    }

                    {step === 1 ? (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.nombre}>
                                        <TextField
                                            label="Nombre"
                                            name="nombre"
                                            value={currentEmpleado.nombre}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                        {errors.nombre && <FormHelperText>{errors.nombre}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.apellido}>
                                        <TextField
                                            label="Apellido"
                                            name="apellido"
                                            value={currentEmpleado.apellido}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            onChange={handleChange}
                                        />
                                        {errors.apellido && <FormHelperText>{errors.apellido}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.telefono}>
                                        <TextField
                                            label="Teléfono"
                                            name="telefono"
                                            type='decimal'
                                            value={currentEmpleado.telefono}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
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
                                        {errors.telefono && <FormHelperText>{errors.telefono}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.fechaNacimiento}>
                                        <TextField
                                            label="Fecha de Nacimiento"
                                            name="fechaNacimiento"
                                            value={currentEmpleado.fechaNacimiento}
                                            type="date"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={handleChange}
                                        />
                                        {errors.fechaNacimiento && <FormHelperText>{errors.fechaNacimiento}</FormHelperText>}
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
                    ) : (
                        <>
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.email}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            value={currentEmpleado.usuario.email}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            onChange={handleUsuarioChange}
                                        />
                                        {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth error={!!errors.rol}>
                                        <TextField
                                            label="Rol"
                                            name="rol"
                                            value={currentEmpleado.usuario.rol}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            select
                                            onChange={handleUsuarioChange}
                                        >
                                            <MenuItem key={1} value={Rol.SUPERADMIN}>
                                                Super Administrador
                                            </MenuItem>
                                            <MenuItem key={2} value={Rol.ADMIN}>
                                                Administrador
                                            </MenuItem>
                                            <MenuItem key={3} value={Rol.CAJERO}>
                                                Cajero
                                            </MenuItem>
                                            <MenuItem key={4} value={Rol.COCINERO}>
                                                Cocinero
                                            </MenuItem>
                                            <MenuItem key={5} value={Rol.DELIVERY}>
                                                Delivery
                                            </MenuItem>
                                        </TextField>
                                        {errors.rol && <FormHelperText>{errors.rol}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button onClick={handleBack} variant="contained" sx={{ ...colorConfigs.backButtonStyles }}>
                                    Atrás
                                </Button>
                                <Button onClick={handleSubmit} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>
                                    {empleado.id !== null && empleado.id > 0 ? "Actualizar Empleado" : "Crear Empleado"}
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default EmpleadoAddModal;