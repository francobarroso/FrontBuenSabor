import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import SideBar from "../components/common/SideBar";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EmpleadoTable from "../components/iu/Empleado/EmpleadoTable";
import { useParams } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import Empleado from "../types/Empleado";
import { EmpleadoGetBySucursal } from "../services/EmpleadoService";
import EmpleadoAddModal from "../components/iu/Empleado/EmpleadoAddModal";
import { toast, ToastContainer } from "react-toastify";
import colorConfigs from "../configs/colorConfig";

const emptyEmpleado: Empleado = {
    id: null,
    eliminado: false,
    sucursal: {
        id: 0,
        eliminado: false,
        nombre: ""
    },
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
    usuario: {
        id: null,
        eliminado: false,
        email: "",
        userName: "",
        rol: null
    },
}

function EmpleadosList() {
    const { idSucursal } = useParams();
    const [empleado, setEmpleado] = useState<Empleado>({ ...emptyEmpleado });
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { getAccessTokenSilently } = useAuth0();

    const getEmpleadosBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const empleados: Empleado[] = await EmpleadoGetBySucursal(Number(idSucursal), token);
        setEmpleados(empleados);
    }

    const handleOpen = () => {
        setEmpleado({ ...emptyEmpleado }); // Reset employee state when opening modal
        setOpen(true);
    }

    const handleClose = async () => {
        try {
            await getEmpleadosBySucursal();
        } catch (error) {
            console.log("Error al traer los empleados.");
        }
        setOpen(false);
    }

    useEffect(() => {
        getEmpleadosBySucursal();
    }, [idSucursal]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        console.log(event);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
        toast.error("Error al crear el empleado, intente más tarde", {
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
            <Box p={0} ml={3} mr={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2, ...colorConfigs.buttonStyles }}>
                    Agregar Empleado
                </Button>
                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Apellido</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Rol</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Estado</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empleados
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((empleado) => (
                                    <EmpleadoTable key={empleado.id} onClose={handleClose} empleado={empleado} />
                                )
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={empleados.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <EmpleadoAddModal open={open} onClose={handleClose} empleado={empleado} success={handleSuccess} error={handleError}/>
            <ToastContainer />
        </>
    )
}

export default EmpleadosList;