import React, { useEffect, useState } from "react";
import SideBar from "../components/common/SideBar";
import UnidadMedida from "../types/UnidadMedida";
import { UnidadMedidaGetAll } from "../services/UnidadMedidaService";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, TablePagination, Stack } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from "@auth0/auth0-react";
import SpeedIcon from '@mui/icons-material/Speed';
import UnidadMedidaTable from "../components/iu/UnidadMedida/UnidadMedidaTable";
import AddIcon from "@mui/icons-material/Add";
import UnidadMedidaAddModal from "../components/iu/UnidadMedida/UnidadMedidaModal";
import colorConfigs from "../configs/colorConfig";
import ProtectedComponent from "../components/auth0/ProtectedComponent";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };

function UnidadMedidaList() {
    const [unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([]);
    const [currentUnidadMedida, setCurrentUnidadMedida] = useState<UnidadMedida>({ ...emptyUnidadMedida });
    const [open, setOpen] = useState(false);
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

    useEffect(() => {
        getAllUnidadMedida();
    }, []);

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

    const handleClose = async () => {
        await getAllUnidadMedida();
        setOpen(false);
    }

    const handleOpen = () => {
        setCurrentUnidadMedida({ ...emptyUnidadMedida });
        setOpen(true)
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
    }

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
                        <ProtectedComponent roles={['administrador', 'superadmin']}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpen}
                                sx={{ ...colorConfigs.buttonStyles }}
                            >
                                Agregar Unidad de Medida
                            </Button>
                        </ProtectedComponent>

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
                                    <UnidadMedidaTable unidad={unidad} onClose={handleClose} />
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

            <UnidadMedidaAddModal open={open} onClose={handleClose} unidad={currentUnidadMedida} success={handleSuccess} error={handleError} />
            <ToastContainer />
        </>
    );
}

export default UnidadMedidaList;