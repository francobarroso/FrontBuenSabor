import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box,
    TablePagination,
    Grid,
    TextField,
    SelectChangeEvent,
    Select,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SideBar from "../components/common/SideBar";
import ArticuloManufacturado from "../types/ArticuloManufacturado";
import { ArticuloManufacturadoFindBySucursal } from "../services/ArticuloManufacturadoService";
import Imagen from "../types/Imagen";
import ArticuloManufacturadoDetalle from "../types/ArticuloManufacturadoDetalle";
import { useAuth0 } from "@auth0/auth0-react";
import ArticuloManufacturadoTable from "../components/iu/ArticuloManufacturado/ArticuloManufacturadoTable";
import ArticuloManufacturadoAddModal from "../components/iu/ArticuloManufacturado/ArticuloManufacturadoAddModal";
import { toast, ToastContainer } from "react-toastify";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloManufacturado = {
    id: 0, eliminado: false, denominacion: '', precioVenta: null, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, descripcion: '', tiempoEstimadoMinutos: null, preparacion: '', articuloManufacturadoDetalles: null
};

function ArticuloManufacturadoList() {
    const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [currentArticuloManufacturado, setCurrentArticuloManufacturado] = useState<ArticuloManufacturado>({ ...emptyArticuloManufacturado });
    const [images, setImages] = useState<string[]>([]);
    const { idSucursal, idEmpresa } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { getAccessTokenSilently } = useAuth0();

    const getAllArticuloManufacturadoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        const articulosManufacturados: ArticuloManufacturado[] = await ArticuloManufacturadoFindBySucursal(Number(idSucursal), token);
        setArticulosManufacturados(articulosManufacturados);
    };

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
    }, [idSucursal, idEmpresa]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        console.log(event);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
        setImages([]);
    };

    const handleCloseModal = async () => {
        await getAllArticuloManufacturadoBySucursal();
        setOpenModal(false);
        setArticuloImages([]);
        setCurrentArticuloManufacturado({ ...emptyArticuloManufacturado });
        if (currentArticuloManufacturado.id > 0) {
            setDetalles(JSON.parse(JSON.stringify(currentArticuloManufacturado.articuloManufacturadoDetalles)));
        } else {
            setDetalles([]);
        }
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
        toast.error("Error al crear el manufacturado, intente más tarde", {
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    };

    const filteredArticulosManufacturado = articulosManufacturados.filter(articulo =>
        articulo.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(articulo => {
        if (filter === "Activos") {
            return articulo.habilitado;
        } else if (filter === "No Activos") {
            return !articulo.habilitado;
        }
        return true;
    });

    const activeManufacturadoCount = articulosManufacturados.filter(articulo => articulo.habilitado).length;

    return (
        <>
            <SideBar />
            <Box p={0} ml={3} mr={3}>
                <Typography variant="h5" gutterBottom fontWeight={'bold'} paddingBottom={'10px'}>
                    Articulos Manufacturados
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} justifyContent="flex-start">
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>Agregar Manufacturado</Button>
                    </Grid>
                    <Grid item xs={3} container justifyContent="center">
                        <TextField
                            variant="outlined"
                            placeholder="Buscar por nombre"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ width: '300px' }}
                        />
                    </Grid>
                    <Grid item xs={3} container justifyContent="center">
                        <Select
                            value={filter}
                            onChange={handleFilterChange}
                            variant="outlined"
                            displayEmpty
                            style={{ width: '150px' }}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            <MenuItem value="Activos">Activos</MenuItem>
                            <MenuItem value="No Activos">No Activos</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={3} container justifyContent="flex-end">
                        <Grid container direction="column" alignItems="flex-end">
                            <Typography variant="h2">
                                {activeManufacturadoCount}
                            </Typography>
                            <Typography variant="h6">
                                Manufacturados Activos
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} style={{ maxHeight: '60vh', marginBottom: '10px', marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Unidad de Medida</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Tiempo (minutos)</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Categoria</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredArticulosManufacturado
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(articulo => articulo.eliminado === false)
                                .map((articulo) => (
                                    <ArticuloManufacturadoTable onClose={handleCloseModal} articulo={articulo} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={filteredArticulosManufacturado.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>

            <ArticuloManufacturadoAddModal open={openModal} onClose={handleCloseModal} articulo={currentArticuloManufacturado} imagenes={images} articuloImagenes={articuloImages} articuloDetalles={detalles} success={handleSuccess} error={handleError} />
            <ToastContainer />
        </>
    );
}

export default ArticuloManufacturadoList;