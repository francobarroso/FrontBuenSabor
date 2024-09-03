import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TablePagination, Select, MenuItem, Stack, SelectChangeEvent } from '@mui/material';
import SideBar from "../components/common/SideBar";
import PedidosTable from '../components/iu/Pedido/PedidoTable';
import { useEffect, useState } from 'react';
import Pedido from '../types/Pedido';
import { PedidoGetBySucursal } from '../services/PedidoService';
import MonitorIcon from '@mui/icons-material/Monitor';
import { Estado } from '../types/enums/Estado';
import { useAppSelector } from '../redux/hook';

function PedidosList() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState("Todos");
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const pedidosActivos = filter === "Todos"
        ? pedidos.length
        : pedidos.filter(pedido => pedido.estado === filter).length;
    const filteredPedidos = pedidos.filter(pedido => {
        if (filter === "Todos") {
            return pedido;
        } else {
            return pedido.estado === filter;
        }
    });

    const getPedidos = async () => {
        if (sucursalRedux) {
            const pedidos: Pedido[] = await PedidoGetBySucursal(sucursalRedux?.id);
            setPedidos(pedidos);
        }
    }

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        console.log(event);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        getPedidos();
    }, [sucursalRedux]);

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
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        variant="outlined"
                        displayEmpty
                        style={{ width: '250px' }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        <MenuItem value={Estado.PENDIENTE}>Pendientes</MenuItem>
                        <MenuItem value={Estado.PREPARACION}>En Preparación</MenuItem>
                        <MenuItem value={Estado.CANCELADO}>Cancelado</MenuItem>
                        <MenuItem value={Estado.ENTREGADO}>Entregado</MenuItem>
                        <MenuItem value={Estado.FACTURADO}>Facturado</MenuItem>
                        <MenuItem value={Estado.DELIVERY}>Delivery</MenuItem>
                    </Select>
                    <Stack direction="column" alignItems="flex-end">
                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            <MonitorIcon /> {pedidosActivos}
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: "18px" }}>
                            Pedidos Activos
                        </Typography>
                    </Stack>
                </Box>
            </Box>

            <Box ml={3} mb={3} mr={3}>
                <Typography variant='h5'></Typography>
                <TableContainer component={Paper} style={{ flex: "1", marginBottom: '10px', marginTop: '20px', backgroundColor: "#c5c5c5", borderRadius: "20px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Fecha</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Hora estimada</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Precio total</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Medio de pago</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Tipo de envio</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Estado</TableCell>
                                <TableCell style={{ color: 'black', fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPedidos
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((pedido) => (
                                    <PedidosTable key={pedido.id} pedido={pedido} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={filteredPedidos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </>
    );
}

export default PedidosList;
