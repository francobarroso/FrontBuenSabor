import { Button, Typography } from "@mui/material";
import { EmpresaGetAll } from "../services/EmpresaService";
import Empresa from "../types/Empresa";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useAuth0 } from "@auth0/auth0-react";
import EmpresaCard from "../components/iu/Empresa/EmpresaCard";
import EmpresaModal from "../components/iu/Empresa/EmpresaModal";
import { toast, ToastContainer } from "react-toastify";

const emptyEmpresa = { id: 0, eliminado: false, nombre: '', razonSocial: '', cuil: null };

function EmpresaList() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [open, setOpen] = useState(false);
    const [currentEmpresa, setCurrentEmpresa] = useState<Empresa>({ ...emptyEmpresa });
    const { getAccessTokenSilently } = useAuth0();

    const getAllEmpresa = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const empresas: Empresa[] = await EmpresaGetAll(token);
        setEmpresas(empresas);
    };

    const handleOpen = (empresa?: Empresa) => {
        if (empresa) {
            setCurrentEmpresa(empresa);
        } else {
            setCurrentEmpresa({ ...emptyEmpresa });
        }
        
        setOpen(true);
    };

    const handleClose = async() => {
        setOpen(false);
        setCurrentEmpresa({ ...emptyEmpresa });
        await getAllEmpresa();
    };

    useEffect(() => {
        getAllEmpresa();
    }, []);

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
        toast.error("Error al crear la empresa, intente más tarde", {
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
                style={{ fontWeight: 'bold', marginBottom: '20px', color: 'black', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
                Seleccione una Empresa
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    style={{ backgroundColor: '#334e77', color: 'white', marginBottom: '20px' }}
                >
                    Crear Empresa
                </Button>
            </div>
            <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '16px',
                justifyContent: 'center',
                padding: '10px',
            }}>
                {empresas.map((empresa) => (
                    <EmpresaCard key={empresa.id} onClose={handleClose} empresa={empresa} />
                ))}
            </div>

            <EmpresaModal open={open} onClose={handleClose} empresa={currentEmpresa} success={handleSuccess} error={handleError}/>
            <ToastContainer />
        </div>
    )

}

export default EmpresaList;