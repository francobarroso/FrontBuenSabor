import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import SideBar from "../components/common/SideBar";
import ProtectedComponent from '../components/auth0/ProtectedComponent';

const data = [
    { id: 1, fecha: '2023-06-29', horaEstimada: '14:00', precioTotal: 1500, medioPago: 'Mercado Pago', tipoEnvio: 'Delivery', estado: 'Pendiente' },
    { id: 2, fecha: '2023-06-28', horaEstimada: '16:00', precioTotal: 1200, medioPago: 'Efectivo', tipoEnvio: 'Retiro en sucursal', estado: 'Preparacion' },
];

function PedidosList() {
    return (
        <>
            <SideBar />
            <Box ml={3} mb={3} mr={3}>
                <Typography variant='h5'></Typography>
                <TableContainer component={Paper} style={{ maxHeight: '400px', marginBottom: '10px', marginTop: '20px' }}>
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
                            {data.map((pedido) => (
                                <TableRow key={pedido.id}>
                                    <TableCell align="center">{pedido.fecha}</TableCell>
                                    <TableCell align="center">{pedido.horaEstimada}</TableCell>
                                    <TableCell align="center">{pedido.precioTotal}</TableCell>
                                    <TableCell align="center">{pedido.medioPago}</TableCell>
                                    <TableCell align="center">{pedido.tipoEnvio}</TableCell>
                                    <TableCell align="center">{pedido.estado}</TableCell>
                                    <TableCell align="center">
                                        <ProtectedComponent roles={["cajero"]}>
                                        <Button variant="contained" color="warning" size="small" sx={{ m: 0.5 }}>A Cocina</Button>
                                        <Button variant="contained" color="error" size="small" sx={{ m: 0.5 }}>Cancelar</Button>
                                        <Button variant="contained" color="primary" size="small" sx={{ m: 0.5 }}>Facturar</Button>
                                        </ProtectedComponent>
                                        <ProtectedComponent roles={["cocinero"]}>
                                        <Button variant="contained" color="info" size="small" sx={{ m: 0.5 }}>Preparado</Button>
                                        </ProtectedComponent>
                                        <ProtectedComponent roles={["delivery"]}>
                                        <Button variant="contained" color="success" size="small" sx={{ m: 0.5 }}>Entregado</Button>
                                        </ProtectedComponent>
                                        <ProtectedComponent roles={["administrador", "cajero"]}>
                                        <Button variant="contained" color="secondary" size="small" sx={{ m: 0.5 }}>Detalles</Button>
                                        </ProtectedComponent>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

export default PedidosList;
