import { useEffect, useState } from "react";
import { Typography, Box, Button, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, Paper, TablePagination, SelectChangeEvent, Select, MenuItem, TextField, Stack } from "@mui/material";
import SideBar from "../components/common/SideBar";
import CategoriaGetDto from "../types/CategoriaGetDto";
import { CategoriaByEmpresaGetAll } from "../services/CategoriaService";
import AddIcon from "@mui/icons-material/Add";
import Categoria from "../types/Categoria";
import { useAuth0 } from "@auth0/auth0-react";
import CategoriaTable from "../components/iu/Categoria/CategoriaTable";
import CategoriaModal from "../components/iu/Categoria/CategoriaModal";
import { toast, ToastContainer } from "react-toastify";
import CategoryIcon from "@mui/icons-material/Category";
import colorConfigs from "../configs/colorConfig";
import ProtectedComponent from "../components/auth0/ProtectedComponent";
import { useAppSelector } from "../redux/hook";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

function CategoriaList() {
    const [categorias, setCategorias] = useState<CategoriaGetDto[]>([]);
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>({ ...emptyCategoria });
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { getAccessTokenSilently } = useAuth0();
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);

    const getAllCategoriaBySucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (sucursalRedux) {
            const categorias: CategoriaGetDto[] = await CategoriaByEmpresaGetAll(sucursalRedux.id, token);
            setCategorias(categorias);
        }
    };

    useEffect(() => {
        getAllCategoriaBySucursal();
    }, [sucursalRedux]);

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
            toastId: 'success-toast'
        });
    }

    const handleError = () => {
        toast.error("Error al crear la categoría, intente más tarde", {
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    };

    const filteredCategoria = categorias
        .filter(categoria =>
            categoria.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(categoria => {
            if (filter === "Insumos") {
                return categoria.esInsumo;
            } else if (filter === "Manufacturados") {
                return !categoria.esInsumo;
            }
            return true;
        });

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
                            Agregar Categoría
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
                        style={{ width: '200px' }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        <MenuItem value="Insumos">Insumos</MenuItem>
                        <MenuItem value="Manufacturados">Manufacturados</MenuItem>
                    </Select>
                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <CategoryIcon /> {categorias.length}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Categorías
                        </Typography>
                    </Stack>
                </Box>

                <TableContainer component={Paper} style={{ flex: "1", marginBottom: '10px', marginTop: '20px', backgroundColor: "#c5c5c5", borderRadius: "20px" }}>
                    <Table sx={{ minHeight: "0" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }}>Nombre</TableCell>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <TableCell style={{ color: 'black', fontWeight: 'bold', textAlign: 'right' }}>Acciones</TableCell>
                                </ProtectedComponent>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCategoria
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(categoria => categoria.categoriaPadre === null && !categoria.eliminado)
                                .map((categoria) => (
                                    <CategoriaTable key={categoria.id} onClose={handleClose} categoria={categoria} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={filteredCategoria.length}
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
