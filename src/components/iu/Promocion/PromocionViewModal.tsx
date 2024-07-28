import React, { useState } from 'react';
import { Modal, Box, Typography, CardMedia, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Promocion from '../../../types/Promocion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

interface ViewPromocionModalProps {
    open: boolean;
    onClose: () => void;
    promocion: Promocion;
}

const ViewPromocionModal: React.FC<ViewPromocionModalProps> = ({ open, onClose, promocion }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % promocion.imagenes.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + promocion.imagenes.length) % promocion.imagenes.length);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "60%",
                maxWidth: "600px",
                maxHeight: "80%",
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 8,
                p: 4,
                overflowY: 'auto',
            }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-title" variant="h6" component="h2">
                    {promocion.denominacion}
                </Typography>
                {promocion.imagenes.length > 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ padding: '8px 0' }}>
                        <IconButton onClick={handlePreviousImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        <CardMedia
                            component="img"
                            height="200"
                            image={promocion.imagenes[currentImageIndex].url}
                            alt={promocion.denominacion}
                            sx={{ maxWidth: '50%', marginTop: '8px', borderRadius: 4 }}
                        />
                        <IconButton onClick={handleNextImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    Vigencia: {promocion.fechaDesde} - {promocion.fechaHasta}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                    ${promocion.precioPromocional}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                    {promocion.descripcionDescuento}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                    Detalles de la promoción:
                </Typography>
                <List>
                    {promocion.promocionDetalles.map((detalle, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${detalle.cantidad} x ${detalle.articulo.denominacion}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
}

export default ViewPromocionModal;