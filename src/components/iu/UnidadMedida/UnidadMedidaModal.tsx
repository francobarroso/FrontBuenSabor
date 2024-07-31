import { Box, Button, FormControl, FormHelperText, IconButton, Modal, TextField, Typography } from "@mui/material";
import UnidadMedida from "../../../types/UnidadMedida";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { UnidadMedidaCreate, UnidadMedidaUpdate } from "../../../services/UnidadMedidaService";
import { useAuth0 } from "@auth0/auth0-react";
import colorConfigs from "../../../configs/colorConfig"


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface UnidadMedidaAddModalProps {
    open: boolean;
    onClose: () => void;
    unidad: UnidadMedida;
    success: () => void;
    error: () => void;
}

const UnidadMedidaAddModal: React.FC<UnidadMedidaAddModalProps> = ({ open, onClose, unidad, success, error }) => {
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState(unidad);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { getAccessTokenSilently } = useAuth0();

    const createUnidadMedida = async (unidadMedida: UnidadMedida) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return UnidadMedidaCreate(unidadMedida, token);
    };

    const updateUnidadMedida = async (unidadMedida: UnidadMedida) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return UnidadMedidaUpdate(unidadMedida, token);
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentUnidadMedida.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setCurrentUnidadMedida(unidad);
        onClose();
    }

    const handleSubmit = async () => {

        if(!validate()){
            return;
        }

        if (currentUnidadMedida.id !== null && currentUnidadMedida.id > 0) {
            try {
                const data = await updateUnidadMedida(currentUnidadMedida);
                if (data.status !== 200) {
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar una unidad de medida");
            }

        } else {
            try {
                const data = await createUnidadMedida(currentUnidadMedida);
                if (data.status !== 200) {
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al crear una unidad de medida");
            }
        }

        success();
        handleClose();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const maxLength: Record<string, number> = {
            denominacion: 25
        };

        if (value.length > maxLength[name]) {
            return;
        }

        setCurrentUnidadMedida(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
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
                        {unidad.id === 0 ? 'Crear Unidad de Medida' : 'Actualizar Unidad de Medida'}
                    </Typography>

                    <FormControl fullWidth error={!!errors.denominacion}>
                        <TextField
                            label="Denominación"
                            name="denominacion"
                            fullWidth
                            margin="normal"
                            value={currentUnidadMedida.denominacion}
                            onChange={handleInputChange}
                        />
                        {errors.denominacion && <FormHelperText>{errors.denominacion}</FormHelperText>}
                    </FormControl>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button onClick={handleSubmit} variant="contained" sx={{ ...colorConfigs.buttonStyles }}>
                            {unidad.id !== null && unidad.id > 0 ? "Actualizar Unidad de Medida" : "Crear Unidad de Medida"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UnidadMedidaAddModal;