import { Avatar, Box, IconButton, Modal, Typography } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Pedido from "../../../types/Pedido";
import DetallePedido from "../../../types/DetallePedido";
import { TipoEnvio } from "../../../types/enums/TipoEnvio";

interface PromocionProps {
    pedido: Pedido;
    open: boolean;
    onClose: () => void;
}

const PedidoModal: React.FC<PromocionProps> = ({ pedido, open, onClose }) => {
    const [currentPedido, setCurrentPedido] = useState<Pedido>(pedido);
    const [detalles, setDetalles] = useState<DetallePedido[]>(pedido.detallePedidos);

    const handleClose = () => {
        setCurrentPedido(pedido);
        setDetalles(pedido.detallePedidos);
        onClose();
    }

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        maxWidth: 800,
                        maxHeight: '80vh',
                        overflow: 'auto',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" gutterBottom align="center">
                        Pedido N° {currentPedido.id}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography variant="h6">
                            Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </Typography>
                        <Typography variant="h6">
                            Hora: {pedido.horaEstimadaFinalizacion
                                ? pedido.horaEstimadaFinalizacion.slice(0, 5)
                                : 'Hora no disponible'}
                        </Typography>
                    </Box>
                    {pedido.tipoEnvio === TipoEnvio.DELIVERY && (
                        <Box mt={3}>
                            <Box mb={1}>
                                <Typography variant="h6">Información del cliente:</Typography>
                            </Box>
                            <Typography variant="body2">Nombre: {pedido.cliente?.nombre} {pedido.cliente?.apellido}</Typography>
                            <Typography variant="body2">Domicilio: {pedido.domicilio?.calle}, {pedido.domicilio?.numero}, {pedido.domicilio?.localidad?.nombre}, {pedido.domicilio?.localidad?.provincia.nombre}</Typography>
                            {pedido.domicilio?.piso !== null && pedido.domicilio?.nroDpto !== null && (
                                <Box>
                                    <Typography variant="body2">Piso: {pedido.domicilio?.piso}</Typography>
                                    <Typography variant="body2">Nro Depto: {pedido.domicilio?.nroDpto}</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                    <Typography mt={3} variant="h6" gutterBottom align="left">
                        Detalles del Pedido:
                    </Typography>
                    {detalles.map((detalle) => (
                        <Box key={detalle.id} mb={1} ml={2} display="flex" alignItems="center">
                            {
                                detalle.articulo !== null ? (
                                    <>
                                        <Avatar
                                            src={detalle.articulo.imagenes?.[0]?.url || 'default-image-url'}
                                            alt={detalle.articulo.denominacion || 'Artículo'}
                                            sx={{ width: 40, height: 40, marginRight: 1 }}
                                        />
                                        <Typography>
                                            {detalle.cantidad} {detalle.articulo.denominacion || 'Artículo'}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <Avatar
                                            src={detalle.promocion.imagenes?.[0]?.url || 'default-image-url'}
                                            alt={detalle.promocion.denominacion || 'Promoción'}
                                            sx={{ width: 40, height: 40, marginRight: 1 }}
                                        />
                                        <Typography>
                                            {detalle.cantidad} {detalle.promocion.denominacion || 'Promoción'}
                                        </Typography>
                                    </>
                                )
                            }
                        </Box>
                    ))}
                </Box>
            </Modal>
        </>
    );
}

export default PedidoModal;