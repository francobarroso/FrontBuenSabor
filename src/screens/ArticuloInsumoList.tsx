import { useEffect, useState } from "react";
import { Button, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, TextField, Select, MenuItem, SelectChangeEvent, Stack } from "@mui/material";
import SideBar from "../components/common/SideBar";
import ArticuloInsumo from "../types/ArticuloInsumo";
import { ArticuloInsumoFindBySucursal } from "../services/ArticuloInsumoService";
import Imagen from "../types/Imagen";
import AddIcon from "@mui/icons-material/Add";
import { useAuth0 } from "@auth0/auth0-react";
import ArticuloInsumoTable from "../components/iu/ArticuloInsumo/ArticuloInsumoTable";
import ArticuloInsumoAddModal from "../components/iu/ArticuloInsumo/ArticuloInusmoAddModal";
import { ToastContainer, toast } from "react-toastify";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import colorConfigs from "../configs/colorConfig"
import ProtectedComponent from "../components/auth0/ProtectedComponent";
import { useAppSelector } from "../redux/hook";

const emptyUnidadMedida = { id: 0, eliminado: false, denominacion: '' };
const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };
const emptyArticuloInsumo = {
    id: 0, eliminado: false, denominacion: '', precioVenta: null, habilitado: true, imagenes: [], unidadMedida: emptyUnidadMedida, categoria: emptyCategoria, sucursal: null, precioCompra: null, stockActual: null, stockMinimo: null, stockMaximo: null, esParaElaborar: false
};

function ArticuloInsumoList() {
    const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
    const [currentArticuloInsumo, setCurrentArticuloInsumo] = useState<ArticuloInsumo>({ ...emptyArticuloInsumo });
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Todos");

    const getAllArticuloInsumoBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (sucursalRedux) {
            const articulosInsumo: ArticuloInsumo[] = await ArticuloInsumoFindBySucursal(sucursalRedux.id, token);
            setArticulosInsumo(articulosInsumo);
        }
    };

    const handleOpen = () => {
        setCurrentArticuloInsumo({ ...emptyArticuloInsumo });
        setArticuloImages([]);
        setImages([]);
        setOpen(true)
    };

    const handleClose = async () => {
        await getAllArticuloInsumoBySucursal();
        setOpen(false);
    };

    useEffect(() => {
        getAllArticuloInsumoBySucursal();
    }, [sucursalRedux]);

    const handleSuccess = () => {
        toast.success("Se creo correctamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    const handleError = () => {
        toast.error("Error al crear el insumo, intente más tarde", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

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

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    };

    const filteredArticulosInsumo = articulosInsumo.filter(articulo =>
        articulo.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(articulo => {
        if (filter === "Activos") {
            return articulo.habilitado;
        } else if (filter === "No Activos") {
            return !articulo.habilitado;
        }
        return true;
    });

    const activeInsumoCount = articulosInsumo.filter(articulo => articulo.habilitado).length;

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
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpen}
                            sx={{ ...colorConfigs.buttonStyles }}
                        >
                            Agregar Insumo
                        </Button>
                    </ProtectedComponent>

                    <TextField
                        variant="outlined"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '300px' }}
                    />
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
                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <ShoppingCartIcon /> {activeInsumoCount}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Insumos Activos
                        </Typography>
                    </Stack>
                </Box>

                <TableContainer component={Paper} style={{ flex: "1", marginBottom: '10px', marginTop: '20px', backgroundColor: "#c5c5c5", borderRadius: "20px" }}>
                    <Table sx={{ minHeight: "0" }}>
                        <TableHead >
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Nombre</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Compra</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio Venta</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Unidad de Medida</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Actual</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Mínimo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Stock Máximo</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Para Elaborar</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Categoría</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredArticulosInsumo
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(articulo => articulo.eliminado === false)
                                .map((articulo) => (
                                    <ArticuloInsumoTable key={articulo.id} onClose={handleClose} articulo={articulo} />
                                )
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={filteredArticulosInsumo.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <ArticuloInsumoAddModal open={open} onClose={handleClose} articulo={currentArticuloInsumo} imagenes={images} articuloImagenes={articuloImages} success={handleSuccess} error={handleError} />
                <ToastContainer />
            </Box>
        </>
    );
}

export default ArticuloInsumoList;