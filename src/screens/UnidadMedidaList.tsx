import React, { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll, UnidadMedidaCreate, UnidadMedidaUpdate, UnidadMedidaDelete } from "../services/UnidadMedidaService";
import {
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TablePagination,
    Stack,
    Tooltip,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from "@auth0/auth0-react";
import SpeedIcon from '@mui/icons-material/Speed';

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };

const buttonStyles = {
    backgroundColor: "#233044",
    '&:hover': {
        backgroundColor: "#48576f"
    }
};

function UnidadMedidaList() {
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState<UnidadMedida>({ ...emptyUnidadMedida });
    const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [unidadToDelete, setUnidadToDelete] = useState<UnidadMedida | null>(null);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { getAccessTokenSilently } = useAuth0();

    const getAllUnidadMedida = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const unidadMedidas: UnidadMedida[] = await UnidadMedidaGetAll(token);
        setUnidadMedidas(unidadMedidas);
    };

    const createUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
            const data = await UnidadMedidaCreate(unidadMedida, token);
            if (data.status !== 200) {
                toast.error("Error al crear la unidad de medida, intente más tarde", {
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
            console.log('Error al crear la unidad de medida', error);
        }

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

        try {
            await getAllUnidadMedida();
        } catch (error) {
            console.log("asd");
        }
    };

    const updateUnidadMedida = async (unidadMedida: UnidadMedida) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
            const data = await UnidadMedidaUpdate(unidadMedida, token);
            if (data.status !== 200) {
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

                return;
            }
        } catch (error) {
            console.log('Error al actualizar la unidad de medida');
        }

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

        try {
            await getAllUnidadMedida();
        } catch (error) {
            console.log("asd");
        }
    };

    const deleteUnidadMedida = async (id: number) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
            const data = await UnidadMedidaDelete(id, token);
            if (data.status !== 200) {
                toast.success("Error al eliminar la unidad de medida, intente más tarde", {
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
                return;
            }
        } catch (error) {
            console.log('Error al eliminar la unidad de medida');
        }

        toast.success("Se eliminó correctamente", {
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

        try {
            await getAllUnidadMedida();
        } catch (error) {
            console.log("asd");
        }
    };

    useEffect(() => {
        getAllUnidadMedida();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUnidadMedida({ ...currentUnidadMedida, denominacion: event.target.value });
    };

    const handleSave = async () => {
        if (!currentUnidadMedida.denominacion.trim()) {
            toast.warning("El campo denominación es obligatorio", {
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
        createUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
    };

    const handleUpdate = async () => {
        if (!currentUnidadMedida.denominacion.trim()) {
            toast.warning("El campo denominación es obligatorio", {
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
        updateUnidadMedida(currentUnidadMedida);
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
        setIsEditing(false);
    };

    const handleEdit = (unidad: UnidadMedida) => {
        setCurrentUnidadMedida(unidad);
        setIsEditing(true);
    };

    const handleOpenDialog = (unidad: UnidadMedida) => {
        setUnidadToDelete(unidad);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setUnidadToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (unidadToDelete) {
            await deleteUnidadMedida(unidadToDelete.id);
            handleCloseDialog();
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        console.log(event);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredUnidadMedida = unidadMedidas
        .filter(unidad =>
            unidad.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
        )

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
                    <Box display="flex" alignItems="center" mb={2}>
                        <TextField
                            label="Denominación"
                            value={currentUnidadMedida.denominacion}
                            onChange={handleInputChange}
                            margin="normal"
                            style={{ marginRight: '8px' }}
                        />
                        <Button
                            variant="contained"
                            onClick={isEditing ? handleUpdate : handleSave}
                            sx={{ ...buttonStyles }}
                        >
                            {isEditing ? "Actualizar" : "Crear"}
                        </Button>
                    </Box>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '300px' }}
                    />
                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <SpeedIcon /> {unidadMedidas.length}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Unidades de Medida
                        </Typography>
                    </Stack>
                </Box>

                <TableContainer component={Paper} style={{ flex: "1", marginBottom: '10px', marginTop: '20px', backgroundColor: "#c5c5c5", borderRadius: "20px" }}>
                    <Table sx={{ minHeight: "0" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold', maxWidth: '200px' }}>Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold', width: '120px' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUnidadMedida
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((unidad) => (
                                    <TableRow key={unidad.id}>
                                        <TableCell>{unidad.denominacion}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Editar" arrow>
                                                <IconButton onClick={() => handleEdit(unidad)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar" arrow>
                                                <IconButton onClick={() => handleOpenDialog(unidad)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={filteredUnidadMedida.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <ToastContainer />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea eliminar esta unidad de medida?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" variant="contained">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UnidadMedidaList;