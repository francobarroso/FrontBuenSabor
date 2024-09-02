import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Empleado from '../../../types/Empleado';

interface ViewPromocionModalProps {
    open: boolean;
    onClose: () => void;
    empleado: Empleado;
}

const EmpleadoViewModal: React.FC<ViewPromocionModalProps> = ({ open, onClose, empleado }) => {

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "40%",
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 8,
                maxWidth: 800,
                p: 4,
            }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-title" variant="h5" component="h2">
                    Empleado: {empleado.nombre} {empleado.apellido}
                </Typography>
                <Typography id="modal-title" variant="h6" component="h2">
                    Rol: {empleado.usuario.rol}
                </Typography>
                <Typography id="modal-title" variant="h6" component="h2">
                    Email: {empleado.usuario.email}
                </Typography>
            </Box>
        </Modal>
    );
}

export default EmpleadoViewModal;