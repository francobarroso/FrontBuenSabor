import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, Stack } from '@mui/material';
import SideBar from '../components/common/SideBar';
import Promocion from '../types/Promocion';
import { PromocionFindBySucursal } from '../services/PromocionService';
import PromocionCard from '../components/iu/Promocion/PromocionCard';
import AddIcon from "@mui/icons-material/Add";
import AddPromocionModal from '../components/iu/Promocion/AddPromocionModal';
import { useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import colorConfigs from "../configs/colorConfig";
import ProtectedComponent from '../components/auth0/ProtectedComponent';
import { useAppSelector } from '../redux/hook';

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
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const [open, setOpen] = useState(false);
    const [currentPromocion, setCurrentPromocion] = useState<Promocion>({ ...emptyPromocion });
    const { getAccessTokenSilently } = useAuth0();

    const getAllPromocionesBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (sucursalRedux) {
            const promociones: Promocion[] = await PromocionFindBySucursal(sucursalRedux.id, token);
            setPromociones(promociones);
        }
    }

    useEffect(() => {
        getAllPromocionesBySucursal();
    }, [sucursalRedux]);

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

    const promocionCount = promociones.filter(promocion => promocion.habilitado && new Date(promocion.fechaHasta) > new Date()).length;

    return (
        <>
            <SideBar />
            <Box p={0} ml={3} mr={3}>
                <Box
                    mt={2}
                    sx={{
                        backgroundColor: "#c5c5c5",
                        borderRadius: "20px",
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <ProtectedComponent roles={['administrador', 'superadmin']}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal} sx={{ ...colorConfigs.buttonStyles }}>
                                Agregar Promoción
                            </Button>
                        </ProtectedComponent>
                    </Box>

                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <AttachMoneyIcon /> {promocionCount}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Promociones Activas
                        </Typography>
                    </Stack>
                </Box>

                <Grid container spacing={3} mt={2}>
                    {promociones.filter(promocion => !promocion.eliminado).map((promocion) => (
                        <Grid item xs={12} sm={6} md={4} key={promocion.id}>
                            <PromocionCard onClose={handleCloseModal} promocion={promocion} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <AddPromocionModal open={open} onClose={handleCloseModal} currentPromocion={currentPromocion} success={handleSuccess} error={handleError} />
            <ToastContainer />
        </>
    )
}

export default PromocionList;