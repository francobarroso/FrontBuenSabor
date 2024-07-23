import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Button } from '@mui/material';
import SideBar from '../components/common/SideBar';
import Promocion from '../types/Promocion';
import { PromocionFindBySucursal } from '../services/PromocionService';
import PromocionCard from '../components/iu/Promocion/PromocionCard';
import AddIcon from "@mui/icons-material/Add";
import AddPromocionModal from '../components/iu/Promocion/AddPromocionModal';
import { useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify';

const emptyPromocion: Promocion = {
    id: null,
    eliminado: false,
    denominacion: '',
    fechaDesde: '',
    fechaHasta: '',
    horaDesde: '',
    horaHasta: '',
    descripcionDescuento: '',
    precioPromocional: null,
    habilitado: true,
    tipoPromocion: null,
    imagenes: [],
    sucursales: [],
    promocionDetalles: [],
};

function PromocionList() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const { idSucursal } = useParams();
    const [open, setOpen] = useState(false);
    const [currentPromocion, setCurrentPromocion] = useState<Promocion>({ ...emptyPromocion });
    const { getAccessTokenSilently } = useAuth0();

    const getAllPromocionesBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const promociones: Promocion[] = await PromocionFindBySucursal(Number(idSucursal), token);
        setPromociones(promociones);
    }

    useEffect(() => {
        getAllPromocionesBySucursal();
    }, [idSucursal]);

    const handleOpenModal = () => {
        setCurrentPromocion({ ...emptyPromocion });
        setOpen(true);
    }

    const handleCloseModal = async () => {
        setOpen(false);
        await getAllPromocionesBySucursal();
        setCurrentPromocion({ ...emptyPromocion });
    }

    const handleSuccess = () => {
        toast.success("Se creó correctamente", {
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
        toast.error("Error al crear la categoría, intente más tarde", {
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
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Promociones
                </Typography>
                <Box mb={2}>
                    <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={handleOpenModal}>
                        Agregar Promoción
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {promociones.filter(promocion => !promocion.eliminado).map((promocion) => (
                        <Grid item xs={12} sm={6} md={4} key={promocion.id}>
                            <PromocionCard onClose={handleCloseModal} promocion={promocion} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <AddPromocionModal open={open} onClose={handleCloseModal} currentPromocion={currentPromocion} success={handleSuccess} error={handleError}/>
            <ToastContainer />
        </>
    )
}

export default PromocionList;