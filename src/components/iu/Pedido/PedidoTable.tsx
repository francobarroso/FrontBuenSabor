import { Button, Chip, TableCell, TableRow } from "@mui/material";
import Pedido from "../../../types/Pedido";
import ProtectedComponent from "../../auth0/ProtectedComponent";
import { FormaPago } from "../../../types/enums/FormaPago";
import { TipoEnvio } from "../../../types/enums/TipoEnvio";
import PedidoModal from "./PedidoModal";
import { useState } from "react";
import { Estado } from "../../../types/enums/Estado";
import { PedidoUpdate } from "../../../services/PedidoService";

const estadoColores: Record<Estado, string> = {
    [Estado.PENDIENTE]: '#efa91e',
    [Estado.PREPARACION]: '#ef471e',
    [Estado.FACTURADO]: '#1e5aef',
    [Estado.DELIVERY]: '#931eef',
    [Estado.CANCELADO]: 'red',
    [Estado.ENTREGADO]: 'green',
    [Estado.PREPARADO]: 'pink',
};

interface PedidosTableProps {
    onClose: () => void;
    pedido: Pedido;
}

const PedidosTable: React.FC<PedidosTableProps> = ({ onClose, pedido }) => {
    const [open, setOpen] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    const handleDetalles = () => {
        setOpen(true);
    }

    const refreshGrid = () => {
        setRenderKey(prevKey => prevKey + 1); // Incrementa la clave para forzar un re-render
    }

    const handleACocina = () => {
        if(pedido.id){
            pedido.estado = Estado.PREPARACION;
            PedidoUpdate(pedido);
            refreshGrid();
        }
    }

    const handleCancelar = () => {
        if(pedido.id){
            pedido.estado = Estado.CANCELADO;
            PedidoUpdate(pedido);
            refreshGrid();
        }
    }

    const handleFacturar = () => {
        if(pedido.id){
            pedido.estado = Estado.FACTURADO;
            PedidoUpdate(pedido);
            refreshGrid();
        }
    }

    const handlePreparado = () => {
        if(pedido.id){
            pedido.estado = pedido.tipoEnvio === TipoEnvio.DELIVERY ? Estado.DELIVERY : Estado.PREPARADO;
            PedidoUpdate(pedido);
            refreshGrid();
        }
    }

    const handleEntregado = () => {
        if(pedido.id){
            pedido.estado = Estado.ENTREGADO;
            PedidoUpdate(pedido);
            refreshGrid();
        }
    }

    return (
        <>
            <TableRow key={`${pedido.id}-${renderKey}`}>
                <TableCell align="center">
                    {new Date(pedido.fechaPedido).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        timeZone: 'UTC'
                    })}
                </TableCell>
                <TableCell align="center">
                    {pedido.horaEstimadaFinalizacion
                        ? pedido.horaEstimadaFinalizacion.slice(0, 5)
                        : 'Hora no disponible'}
                </TableCell>
                <TableCell align="center">${pedido.total}</TableCell>
                <TableCell align="center">{pedido.formaPago === FormaPago.MERCADO_PAGO ?
                    <Chip
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                        label="Mercado Pago"
                    />
                    :
                    <Chip
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                        label="Efectivo"
                    />
                }</TableCell>
                <TableCell align="center">{pedido.tipoEnvio === TipoEnvio.DELIVERY ? "Delivery" : "Take Away"}</TableCell>
                <TableCell align="center">
                    {
                        pedido.estado !== null && (
                            <Chip
                                size="small"
                                sx={{ ml: 1, color: "white", backgroundColor: estadoColores[pedido.estado] }}
                                label={pedido.estado}
                            />
                        )
                    }
                </TableCell>
                <TableCell align="center">
                    <ProtectedComponent roles={["superadmin", "cajero"]}>
                        <Button variant="contained" color="warning" size="small" sx={{ m: 0.5 }} onClick={handleACocina} hidden={pedido.estado!==Estado.FACTURADO}>A Cocina</Button>
                        <Button variant="contained" color="error" size="small" sx={{ m: 0.5 }} onClick={handleCancelar} hidden={pedido.estado===Estado.ENTREGADO || pedido.estado===Estado.CANCELADO}>Cancelar</Button>
                        <Button variant="contained" color="primary" size="small" sx={{ m: 0.5 }} onClick={handleFacturar} hidden={pedido.estado!==Estado.PENDIENTE}>Facturar</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "cocinero"]}>
                        <Button variant="contained" color="info" size="small" sx={{ m: 0.5 }} onClick={handlePreparado} hidden={pedido.estado!==Estado.PREPARACION}>Preparado</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "delivery"]}>
                        <Button variant="contained" color="success" size="small" sx={{ m: 0.5 }} onClick={handleEntregado} hidden={pedido.estado!==Estado.PREPARADO}>Entregado</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "administrador", "cajero", "cocinero", "delivery"]}>
                        <Button variant="contained" color="secondary" size="small" sx={{ m: 0.5 }} onClick={handleDetalles}>Detalles</Button>
                    </ProtectedComponent>
                </TableCell>
            </TableRow>
            <PedidoModal pedido={pedido} open={open} onClose={handleClose} />
        </>
    )
};

export default PedidosTable;
