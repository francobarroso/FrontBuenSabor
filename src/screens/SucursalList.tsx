import { useEffect, useState } from "react";
import { SucursalGetByEmpresaId } from "../services/SucursalService";
import Sucursal from "../types/Sucursal";
import { Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useAuth0 } from "@auth0/auth0-react";
import SucursalCard from "../components/iu/Sucursal/SucursalCard";
import SucursalModal from "../components/iu/Sucursal/SucursalModal";
import { toast, ToastContainer } from "react-toastify";
import { useAppSelector } from "../redux/hook";

const emptyEmpresa = { id: 0, eliminado: false, nombre: '', razonSocial: '', cuil: 0 };

const emptySucursal = {
    id: 0,
    eliminado: false,
    nombre: '',
    horarioApertura: '',
    horarioCierre: '',
    esCasaMatriz: false,
    domicilio: { id: 0, eliminado: false, calle: '', numero: null, cp: null, piso: null, nroDpto: null, localidad: null },
    empresa: emptyEmpresa
};

function SucursalList() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [open, setOpen] = useState(false);
    const [currentSucursal, setCurrentSucursal] = useState<Sucursal>({ ...emptySucursal });
    const [hasCasaMatriz, setHasCasaMatriz] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);

    const getAllSucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if(empresaRedux){
            const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(empresaRedux.id), token);
            setSucursales(sucursales);
        }
    };

    useEffect(() => {
        getAllSucursal();
    }, []);

    const handleOpen = (sucursal?: Sucursal) => {
        if (sucursal) {
            setCurrentSucursal(sucursal);
        } else {
            setCurrentSucursal({ ...emptySucursal });
        }
        const hasCasaMatriz = sucursales.some(sucursal => sucursal.esCasaMatriz);
        setHasCasaMatriz(hasCasaMatriz);

        setOpen(true);
    };

    const handleClose = async () => {
        await getAllSucursal();
        setOpen(false);
        setCurrentSucursal({ ...emptySucursal });
    };

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
        toast.error("Error al crear la sucursal, intente más tarde", {
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
        <div style={{ backgroundColor: '#c5c5c5', padding: '20px', borderRadius: '8px' }}>
            <Typography
                variant="h4"
                component="h4"
                align="center"
                style={{ fontWeight: 'bold', marginBottom: '20px', color: '#2e7d32', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
                Seleccione una Sucursal
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    style={{ backgroundColor: '#2e7d32', color: 'white', marginBottom: '20px' }}
                >
                    Agregar nueva Sucursal
                </Button>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                marginTop: '16px',
                padding: '10px',
            }}>
                {sucursales.map((sucursal) => (
                    <SucursalCard key={sucursal.id} onClose={handleClose} sucursal={sucursal}/>
                ))}
            </div>

            <SucursalModal open={open} onClose={handleClose} sucursal={currentSucursal} success={handleSuccess} error={handleError} hasCasaMatriz={hasCasaMatriz}/>
            <ToastContainer />
        </div>
    );


}

export default SucursalList;