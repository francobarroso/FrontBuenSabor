import { Box, Button, FormControl, FormHelperText, IconButton, Modal, TextField, Typography } from "@mui/material";
import Empresa from "../../../types/Empresa";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { EmpresaCreate, EmpresaUpdate } from "../../../services/EmpresaService";
import { useAuth0 } from "@auth0/auth0-react";
import colorConfigs from "../../../configs/colorConfig";

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

interface EmpresaCardProps {
    open: boolean;
    onClose: () => void;
    empresa: Empresa;
    success: () => void;
    error: () => void;
}

const EmpresaModal: React.FC<EmpresaCardProps> = ({ open, onClose, empresa, success, error }) => {
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>(empresa);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { getAccessTokenSilently } = useAuth0();

    const createEmpresa = async (empresa: Empresa) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return EmpresaCreate(empresa, token);
    };

    const updateEmpresa = async (empresa: Empresa) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return EmpresaUpdate(empresa, token);
    };

    const handleClose = () => {
        setCurrentEmpresa(empresa);
        setErrors({});
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "nombre" && value.length <= 25 && /^[A-Za-z0-9\s]*$/.test(value)) {
            setCurrentEmpresa(prev => ({ ...prev, [name]: value }));
            if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        } else if (name === "razonSocial" && value.length <= 20 && /^[A-Za-z\s]*$/.test(value)) {
            setCurrentEmpresa(prev => ({ ...prev, [name]: value }));
            if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        } else if (name === "cuil" && value.length <= 11 && /^[0-9]*$/.test(value)) {
            setCurrentEmpresa(prev => ({ ...prev, [name]: parseInt(value, 10) }));
            if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        }
    };


    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentEmpresa.nombre) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (!currentEmpresa.razonSocial) {
            newErrors.razonSocial = 'La razon social es obligatoria.';
        }
        if (!currentEmpresa.cuil) {
            newErrors.cuil = 'El cuil es obligatorio.';
        } else if(currentEmpresa.cuil.toString().length !== 11) {
            newErrors.cuil = 'El campo cuil debe tener 11 dígitos.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        if (currentEmpresa.id > 0) {
            try {
                const data = await updateEmpresa(currentEmpresa);
                if(data.status !== 200){
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al actualizar la empresa.");
            }
        } else {
            try {
                const data = await createEmpresa(currentEmpresa);
                if(data.status !== 200){
                    error();
                    return;
                }
            } catch (error) {
                console.log("Error al crear la empresa.");
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
                {
                    currentEmpresa.id > 0 ?
                        <Typography variant="h6" gutterBottom>
                            Actualizar Empresa
                        </Typography>
                        :
                        <Typography variant="h6" gutterBottom>
                            Crear Empresa
                        </Typography>
                }
                <Box mb={2}>
                    <FormControl fullWidth error={!!errors.nombre}>
                        <TextField
                            margin="dense"
                            label="Nombre"
                            name="nombre"
                            fullWidth
                            value={currentEmpresa.nombre}
                            onChange={handleChange}
                        />
                        {errors.nombre && <FormHelperText>{errors.nombre}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.razonSocial}>
                        <TextField
                            margin="dense"
                            label="Razón Social"
                            name="razonSocial"
                            fullWidth
                            value={currentEmpresa.razonSocial}
                            onChange={handleChange}
                        />
                        {errors.razonSocial && <FormHelperText>{errors.razonSocial}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth error={!!errors.cuil}>
                        <TextField
                            margin="dense"
                            label="Cuil"
                            name="cuil"
                            fullWidth
                            type="decimal"
                            value={currentEmpresa.cuil || null}
                            onChange={handleChange}
                            disabled={!!currentEmpresa.id}
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
                        {errors.cuil && <FormHelperText>{errors.cuil}</FormHelperText>}
                    </FormControl>

                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={handleSave} variant="contained" sx={{...colorConfigs.buttonStyles}}>{currentEmpresa.id > 0 ? "Actualizar" : "Crear"}</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default EmpresaModal;