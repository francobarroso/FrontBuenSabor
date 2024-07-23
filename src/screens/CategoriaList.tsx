import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, Paper, TablePagination } from "@mui/material";
import SideBar from "../components/common/SideBar";
import CategoriaGetDto from "../types/CategoriaGetDto";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import AddIcon from "@mui/icons-material/Add";
import Categoria from "../types/Categoria";
import { useAuth0 } from "@auth0/auth0-react";
import CategoriaTable from "../components/iu/Categoria/CategoriaTable";
import CategoriaModal from "../components/iu/Categoria/CategoriaModal";
import { toast, ToastContainer } from "react-toastify";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<CategoriaGetDto[]>([]);
    const { idSucursal } = useParams();
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { getAccessTokenSilently } = useAuth0();

    const getAllCategoriaBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        const categorias: CategoriaGetDto[] = await CategoriaByEmpresaGetAll(Number(idSucursal), token);
        setCategorias(categorias);
    };

    useEffect(() => {
        getAllCategoriaBySucursal();
    }, [idSucursal]);

    const handleOpen = () => {
        setCurrentCategoria(emptyCategoria);
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        await getAllCategoriaBySucursal();
        setCurrentCategoria(emptyCategoria);
    };


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

    return (
        <>
            <SideBar />
            <Box p={0} ml={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Categorías
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                    Agregar Categoría
                </Button>

                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
                    <Table >
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(categoria => categoria.categoriaPadre === null && !categoria.eliminado)
                                .map((categoria) => (
                                    <CategoriaTable onClose={handleClose} categoria={categoria} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={categorias.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Box>
            <CategoriaModal open={open} onClose={handleClose} categoria={currentCategoria} success={handleSuccess} error={handleError} />
            <ToastContainer />
        </>
    );
}

export default CategoriaList;