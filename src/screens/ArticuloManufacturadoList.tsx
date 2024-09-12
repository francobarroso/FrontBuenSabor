import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box,
    TablePagination,
    TextField,
    SelectChangeEvent,
    Select,
    MenuItem,
    Stack
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
import FastfoodIcon from '@mui/icons-material/Fastfood';
import colorConfigs from "../configs/colorConfig";
import ProtectedComponent from "../components/auth0/ProtectedComponent";
import { useAppSelector } from "../redux/hook";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloManufacturado = {
    id: 0, eliminado: false, denominacion: '', precioVenta: null, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, descripcion: '', tiempoEstimadoMinutos: null, preparacion: '', articuloManufacturadoDetalles: null
};

function ArticuloManufacturadoList() {
    const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturado[]>([]);
    const [currentArticuloManufacturado, setCurrentArticuloManufacturado] = useState<ArticuloManufacturado>({ ...emptyArticuloManufacturado });
    const [images, setImages] = useState<string[]>([]);
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
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

        if (sucursalRedux) {
            const articulosManufacturados: ArticuloManufacturado[] = await ArticuloManufacturadoFindBySucursal(sucursalRedux.id, token);
            setArticulosManufacturados(articulosManufacturados);
        }
    };

    useEffect(() => {
        getAllArticuloManufacturadoBySucursal();
    }, [sucursalRedux]);

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
                    <ProtectedComponent roles={['administrador', 'superadmin']}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenModal}
                            sx={{ ...colorConfigs.buttonStyles }}
                        >
                            Agregar Manufacturado
                        </Button>
                    </ProtectedComponent>

                    <TextField
                        variant="outlined"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ width: '250px' }}
                    />
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        variant="outlined"
                        displayEmpty
                        sx={{ width: '150px' }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        <MenuItem value="Activos">Activos</MenuItem>
                        <MenuItem value="No Activos">No Activos</MenuItem>
                    </Select>
                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <FastfoodIcon /> {activeManufacturadoCount}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Manufacturados Activos
                        </Typography>
                    </Stack>
                </Box>
                <TableContainer component={Paper} style={{ flex: "1", marginBottom: '10px', marginTop: '20px', backgroundColor: "#c5c5c5", borderRadius: "20px" }}>
                    <Table sx={{ minHeight: "0" }}>
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
                    sx={{ alignSelf: 'flex-end' }}
                />
            </Box>

            <ArticuloManufacturadoAddModal open={openModal} onClose={handleCloseModal} articulo={currentArticuloManufacturado} imagenes={images} articuloImagenes={articuloImages} articuloDetalles={detalles} success={handleSuccess} error={handleError} />
            <ToastContainer />
        </>
    );
}

export default ArticuloManufacturadoList;