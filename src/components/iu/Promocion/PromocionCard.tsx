import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Promocion from '../../../types/Promocion';
import AddPromocionModal from './AddPromocionModal';
import Visibility from '@mui/icons-material/Visibility';
import ViewPromocionModal from './PromocionViewModal';
import { PromocionUpdate } from '../../../services/PromocionService';
import { useAuth0 } from '@auth0/auth0-react';
import DesactivarComponent from '../Advertencias/DesactivarComponent';
import ActivarComponent from '../Advertencias/ActivarComponent';
import { toast } from 'react-toastify';
import ProtectedComponent from '../../auth0/ProtectedComponent';

interface PromocionCardProps {
    onClose: () => void;
    promocion: Promocion;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ onClose, promocion }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openBaja, setOpenBaja] = useState(false);
    const [openAlta, setOpenAlta] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const isActiva = new Date(promocion.fechaHasta) > new Date();

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % promocion.imagenes.length);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + promocion.imagenes.length) % promocion.imagenes.length);
    };

    const handleEdit = () => {
        setOpenEdit(true);
    }

    const handleCloseModal = async () => {
        setOpenEdit(false);
        onClose();
    }

    const handleView = () => {
        setOpenView(true);
    }

    const handleCloseViewModal = () => {
        setOpenView(false);
    }

    const handleBaja = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (promocion.id !== null) {
            promocion.habilitado = false;
            const data = await PromocionUpdate(promocion, token);
            if (data.status !== 200) {
                toast.error("No se pudo dar deshabilitar la promoción, intente más tarde", {
                    position: "top-right",
                    autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
                return;
            }
        }

        toast.success("Se deshabilitó correctamente", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        onClose();
        handleCloseDialog();
    }

    const handleAlta = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (promocion.id !== null) {
            promocion.habilitado = true;
            const data = await PromocionUpdate(promocion, token);
            if (data.status !== 200) {
                toast.error("No se pudo habilitar la promoción, intente más tarde", {
                    position: "top-right",
                    autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
                return;
            }
        }

        toast.success("Se habilito correctamente", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        onClose();
        handleCloseDialog();
    }

    const handleOpenBaja = () => {
        setOpenBaja(true);
    }

    const handleOpenAlta = () => {
        setOpenAlta(true);
    }

    const handleCloseDialog = () => {
        setOpenBaja(false);
        setOpenAlta(false);
    }

    const handleSuccess = () => {
        toast.success("Se actualizó correctamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            toastId: 'success-toast' // Asegura que el toast tenga un ID único
        });
    }

    const handleError = () => {
        toast.error("Error al actualizar la categoría, intente más tarde", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }


    return (
        <Box>
            <Card sx={{ maxWidth: 300, margin: 'auto' }}>
                <CardHeader
                    title={promocion.denominacion}
                    subheader={`Vigencia: ${promocion.fechaDesde} - ${promocion.fechaHasta}`}
                    sx={{ padding: '8px 16px' }}
                    titleTypographyProps={{ variant: 'h6' }}
                    subheaderTypographyProps={{ variant: 'body2' }}
                />
                {promocion.imagenes.length > 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ padding: '8px 0' }}>
                        <IconButton onClick={handlePreviousImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                        <CardMedia
                            component="img"
                            height="150"
                            image={promocion.imagenes[currentImageIndex].url}
                            alt={promocion.denominacion}
                            sx={{ maxWidth: '100%', marginTop: '8px', borderRadius: 4 }}
                        />
                        <IconButton onClick={handleNextImage} disabled={promocion.imagenes.length <= 1}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                <CardContent sx={{ padding: '8px 16px' }}>
                    <Typography variant="h6" color="text.primary" sx={{ marginBottom: '8px' }}>
                        ${promocion.precioPromocional}
                    </Typography>
                    {
                        promocion.habilitado ? <Typography variant="body2" sx={{
                            display: 'inline-block',
                            border: '1px solid',
                            backgroundColor: isActiva ? 'green' : 'red',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            color: 'white',
                            marginBottom: '8px'
                        }}>
                            {isActiva ? 'ACTIVA' : 'FINALIZADA'}
                        </Typography>
                            :
                            <Typography variant="body2" sx={{
                                display: 'inline-block',
                                border: '1px solid',
                                backgroundColor: 'orangered',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                color: 'white',
                                marginBottom: '8px'
                            }}>
                                DESACTIVADA
                            </Typography>
                    }
                    {
                        promocion.habilitado ?
                            <>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Editar" arrow>
                                        <IconButton aria-label="edit" color='primary' size="small" onClick={handleEdit}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Deshabilitar" arrow>
                                        <IconButton aria-label="baja" color='error' size="small" onClick={handleOpenBaja}>
                                            <RemoveCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </ProtectedComponent>

                                <Tooltip title="Ver Promoción" arrow>
                                    <IconButton aria-label="view" color='secondary' size="small" onClick={handleView}>
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                            </>
                            :
                            <>
                                <Tooltip title="Ver Promoción" arrow>
                                    <IconButton aria-label="view" color='secondary' size="small" onClick={handleView}>
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Habilitar" arrow>
                                        <IconButton aria-label="alta" color='success' size="small" onClick={handleOpenAlta}>
                                            <KeyboardDoubleArrowUpIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </ProtectedComponent>
                            </>
                    }
                </CardContent>
            </Card>
            <AddPromocionModal open={openEdit} onClose={handleCloseModal} currentPromocion={promocion} success={handleSuccess} error={handleError} />
            <ViewPromocionModal open={openView} onClose={handleCloseViewModal} promocion={promocion} />
            <DesactivarComponent openDialog={openBaja} onClose={handleCloseDialog} onConfirm={handleBaja} tipo='la promoción' entidad={promocion} />
            <ActivarComponent openDialog={openAlta} onClose={handleCloseDialog} onConfirm={handleAlta} tipo='la promoción' entidad={promocion} />
        </Box>
    );
};

export default PromocionCard;