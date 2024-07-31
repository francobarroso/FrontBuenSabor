import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import colorConfigs from "../../../configs/colorConfig"

interface ArticuloManufacturadoViewModalProps {
    view: boolean;
    onClose: () => void;
    articulo: ArticuloManufacturado;
    images: string[];
}

const ArticuloManufacturadoViewModal: React.FC<ArticuloManufacturadoViewModalProps> = ({ view, onClose, articulo, images }) => {
    const [currentArticuloManufacturado, setCurrentArticuloManufacturado] = useState<ArticuloManufacturado>(articulo);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleClose = () => {
        setCurrentArticuloManufacturado(articulo);
        onClose();
    }

    return (
        <>
            <Modal open={view} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%', // Ancho del modal
                        maxWidth: 800, // Máximo ancho del modal
                        maxHeight: '80vh',
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 8, // Borde redondeado del modal
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h5" gutterBottom align="center">
                        {currentArticuloManufacturado.denominacion}
                    </Typography>
                    {images.length > 0 && (
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <IconButton onClick={handlePreviousImage} disabled={images.length <= 1}>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <img
                                src={images[currentImageIndex]}
                                alt={`Imagen ${currentImageIndex}`}
                                style={{ maxWidth: '40%', marginTop: '10px', borderRadius: 8 }} // Ajustes de estilo para la imagen
                            />
                            <IconButton onClick={handleNextImage} disabled={images.length <= 1}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    )}
                    <Typography variant="h6" gutterBottom>
                        Descripcion:
                    </Typography>
                    <Typography variant="body2" gutterBottom mb={3}>
                        {currentArticuloManufacturado.descripcion}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Preparación:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {currentArticuloManufacturado.preparacion}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" onClick={handleClose} sx={{...colorConfigs.buttonStyles}}>
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ArticuloManufacturadoViewModal;