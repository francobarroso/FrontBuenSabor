import { useAuth0 } from "@auth0/auth0-react";
import UnidadMedida from "../../../types/UnidadMedida";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { toast } from "react-toastify";
import { UnidadMedidaDelete } from "../../../services/UnidadMedidaService";
import UnidadMedidaAddModal from "./UnidadMedidaModal";
import EliminarComponent from "../Advertencias/EliminarComponent";
import ProtectedComponent from "../../auth0/ProtectedComponent";

interface UnidadMedidaTableProps {
    onClose: () => void;
    unidad: UnidadMedida;
}

const UnidadMedidaTable: React.FC<UnidadMedidaTableProps> = ({ onClose, unidad }) => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const deleteUnidadMedida = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return UnidadMedidaDelete(unidad.id, token);

    };

    const handleEdit = () => {
        setOpen(true);
    }

    const handleOpenDelete = () => {
        setOpenDelete(true);
    }

    const handleCloseDialog = () => {
        setOpenDelete(false);
    }

    const handleDelete = async () => {
        try {
            const data = await deleteUnidadMedida();
            if (data.status !== 200) {
                toast.error(data.data.message, {
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

        } catch (error) {
            console.log("Error al eliminar la unidad de medida");
        }

        toast.success("Se eliminó correctamente", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        handleClose();
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
        toast.error("Error al actualizar la unidad de medida, intente más tarde", {
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

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    return (
        <>
            <TableRow key={unidad.id}>
                <TableCell>{unidad.denominacion}</TableCell>
                <TableCell>
                    <ProtectedComponent roles={['administrador', 'superadmin']}>
                        <Tooltip title="Editar" arrow>
                            <IconButton onClick={handleEdit} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton onClick={handleOpenDelete} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </ProtectedComponent>
                </TableCell>
            </TableRow>
            <UnidadMedidaAddModal open={open} onClose={handleClose} unidad={unidad} success={handleSuccess} error={handleError} />
            <EliminarComponent openDialog={openDelete} onConfirm={handleDelete} onClose={handleCloseDialog} tipo="la unidad de medida" entidad={unidad} />
        </>
    )
};

export default UnidadMedidaTable;