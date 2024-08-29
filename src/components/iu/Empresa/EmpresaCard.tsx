import { Button, Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";
import Empresa from "../../../types/Empresa";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import EmpresaModal from "./EmpresaModal";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../redux/hook";
import { setEmpresa } from "../../../redux/slices/empresaSlice";

interface EmpresaCardProps {
    onClose: () => void;
    empresa: Empresa;
}

const EmpresaCard: React.FC<EmpresaCardProps> = ({ onClose, empresa }) => {
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const redirectSucursal = () => {
        dispatch(setEmpresa(empresa));
        navigate('/sucursales');
    };

    const handleOpen = () => {
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
        toast.error("Error al actualizar la empresa, intente más tarde", {
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
            <Card key={empresa.id} style={{ width: '250px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                <CardHeader
                    title={empresa.nombre}
                    subheader={empresa.razonSocial}
                    titleTypographyProps={{ variant: 'h5', color: 'black' }}
                    subheaderTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
                <CardActions style={{ justifyContent: 'space-between' }}>
                    <Tooltip title="Editar">
                        <IconButton onClick={handleOpen} color="primary">
                            <EditIcon sx={{ color: "#334e77" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sucursales">
                        <Button
                            variant="contained"
                            sx={{
                                height: '30px',
                                width: '170px',
                                backgroundColor: '#334e77',
                                '&:hover': {
                                    backgroundColor: '#253b5c',
                                },
                            }}
                            onClick={redirectSucursal}
                        >
                            <VisibilityIcon /> Ver Sucursales
                        </Button>
                    </Tooltip>
                </CardActions>
            </Card>

            <EmpresaModal open={editOpen} onClose={handleClose} empresa={empresa} success={handleSuccess} error={handleError} />
        </>
    )
}

export default EmpresaCard;