import { Box, IconButton, TableCell, TableRow } from "@mui/material";
import Empleado from "../../../types/Empleado";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from '@mui/icons-material/Visibility';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from "react";
import EmpleadoAddModal from "./EmpleadoAddModal";
import EmpleadoViewModal from "./EmpleadoViewModal";
import { EmpleadoUpdate } from "../../../services/EmpleadoService";
import { useAuth0 } from "@auth0/auth0-react";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { toast } from "react-toastify";
import DesactivarComponent from "../Advertencias/DesactivarComponent";
import ActivarComponent from "../Advertencias/ActivarComponent";

interface EmpleadoTableProps {
    onClose: () => void;
    empleado: Empleado;
}

const EmpleadoTable: React.FC<EmpleadoTableProps> = ({ onClose, empleado }) => {
    const [view, setView] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [openBaja, setOpenBaja] = useState(false);
    const [openAlta, setOpenAlta] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const handleEdit = () => {
        setEditOpen(true);
    }

    const handleBaja = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        try {
            if (empleado.id !== null) {
                empleado.eliminado = true;
                await EmpleadoUpdate(empleado, token);
            }
        } catch (error) {
            console.log("Error al eliminar el empleado");
        }

        handleCloseDialog();
        handleClose();
    }

    const handleAlta = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        try {
            if (empleado.id !== null) {
                empleado.eliminado = false;
                await EmpleadoUpdate(empleado, token);
            }
        } catch (error) {
            console.log("Error al eliminar el empleado");
        }
        
        handleCloseDialog();
        handleClose();
    }

    const handleCloseDialog = () => {
        setOpenBaja(false);
        setOpenAlta(false);
    }

    const handleOpenBaja = () => {
        setOpenBaja(true);
    }

    const handleOpenAlta = () => {
        setOpenAlta(true);
    }


    const handleView = () => {
        setView(true);
    }

    const handleClose = () => {
        setEditOpen(false);
        setView(false);
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
        toast.error("Error al actualizar el empleado, intente más tarde", {
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
            <TableRow sx={{ backgroundColor: !empleado.eliminado ? "none" : "#788293" }} key={empleado.id}>
                <TableCell align="center">{empleado.nombre}</TableCell>
                <TableCell align="center">{empleado.apellido}</TableCell>
                <TableCell align="center">{empleado.usuario.rol}</TableCell>
                <TableCell align="center">{empleado.eliminado ? 'Inactivo' : 'Activo'}</TableCell>
                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">
                    <Box sx={{ marginLeft: 'auto' }}>
                        {
                            !empleado.eliminado ?
                                <>
                                    <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
                                    <IconButton onClick={handleView} color="secondary"><Visibility /></IconButton>
                                    <IconButton onClick={handleOpenBaja} color="error"><RemoveCircleOutlineIcon /></IconButton>
                                </>
                                :
                                <>
                                    <IconButton onClick={handleView} color="secondary"><Visibility /></IconButton>
                                    <IconButton onClick={handleOpenAlta} color="success"><KeyboardDoubleArrowUpIcon /></IconButton>
                                </>
                        }
                    </Box>
                </TableCell>
            </TableRow>
            <EmpleadoAddModal open={editOpen} onClose={handleClose} empleado={empleado} success={handleSuccess} error={handleError} />
            <EmpleadoViewModal open={view} onClose={handleClose} empleado={empleado} />
            <DesactivarComponent openDialog={openBaja} onClose={handleCloseDialog} onConfirm={handleBaja} tipo='él empleado' entidad={empleado} />
            <ActivarComponent openDialog={openAlta} onClose={handleCloseDialog} onConfirm={handleAlta} tipo='la promoción' entidad={empleado} />
        </>
    );
}

export default EmpleadoTable;