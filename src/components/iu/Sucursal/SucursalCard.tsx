import { Button, Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import SucursalModal from "./SucursalModal";
import Sucursal from "../../../types/Sucursal";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import { SucursalGetByEmpresaId } from "../../../services/SucursalService";
import { useDispatch } from "react-redux";
import { setSucursal } from "../../../redux/slices/sucursalSlice";
import { useAppSelector } from "../../../redux/hook";

interface EmpresaCardProps {
    onClose: () => void;
    sucursal: Sucursal;
}

const SucursalCard: React.FC<EmpresaCardProps> = ({ onClose, sucursal }) => {
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [hasCasaMatriz, setHasCasaMatriz] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    const estaInicio = location.pathname.includes('inicio');
    const dispatch = useDispatch();
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);

    const getAllSucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if(empresaRedux){
            const sucursales: Sucursal[] = await SucursalGetByEmpresaId(empresaRedux.id, token);
            setSucursales(sucursales);
        }
    };

    const redirectDashboard = () => {
        dispatch(setSucursal(sucursal));
        navigate('/estadisticas');
    }

    const handleOpen = () => {
        const hasCasaMatriz = sucursales.some(sucursal => sucursal.esCasaMatriz);
        setHasCasaMatriz(hasCasaMatriz);
        setEditOpen(true);
    };

    const handleClose = () => {
        setEditOpen(false);
        onClose();
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
        toast.error("Error al actualizar la sucursal, intente más tarde", {
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

    useEffect(() => {
        getAllSucursal();
    }, [])

    return (
        <>
            <Card key={sucursal.id} style={{ width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                <CardHeader
                    title={sucursal.nombre}
                    subheader={`${sucursal.domicilio.calle} ${sucursal.domicilio.numero}, ${sucursal.domicilio.cp}, ${sucursal.domicilio.localidad?.nombre}, ${sucursal.domicilio.localidad?.provincia.nombre}`}
                    titleTypographyProps={{ variant: 'h6', color: 'Black', fontWeight: 'bold' }}
                    subheaderTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
                <CardActions style={{ justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        Casa Matriz: {sucursal.esCasaMatriz ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </span>
                    <div>
                    {!estaInicio && (
                        <div>
                            <Tooltip title="Editar">
                                <IconButton onClick={handleOpen} color="primary">
                                    <EditIcon color="success"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver">
                                <Button variant="contained" color="success" sx={{ height: "30px", width: "90px" }} onClick={redirectDashboard}>
                                    <VisibilityIcon /> Ver
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                    </div>
                </CardActions>
            </Card>

            <SucursalModal open={editOpen} onClose={handleClose} sucursal={sucursal} success={handleSuccess} error={handleError} hasCasaMatriz={hasCasaMatriz}/>
        </>
    )
}

export default SucursalCard;