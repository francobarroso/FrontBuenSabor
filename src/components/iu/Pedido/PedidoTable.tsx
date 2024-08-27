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
    [Estado.ENTREGADO]: 'green'
};

interface PedidosTableProps {
    onClose: () => void;
    pedido: Pedido;
}

const PedidosTable: React.FC<PedidosTableProps> = ({ onClose, pedido }) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    const handleDetalles = () => {
        setOpen(true);
    }

    const handlePdf = () => {
        if(pedido.id){
            pedido.estado = Estado.PREPARACION;
            PedidoUpdate(pedido);
        }
    }

    return (
        <>
            <TableRow key={pedido.id}>
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
                        <Button variant="contained" color="warning" size="small" sx={{ m: 0.5 }}>A Cocina</Button>
                        <Button variant="contained" color="error" size="small" sx={{ m: 0.5 }}>Cancelar</Button>
                        <Button variant="contained" color="primary" size="small" sx={{ m: 0.5 }}>Facturar</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "cocinero"]}>
                        <Button variant="contained" color="info" size="small" sx={{ m: 0.5 }}>Preparado</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "delivery"]}>
                        <Button variant="contained" color="success" size="small" sx={{ m: 0.5 }}>Entregado</Button>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "administrador", "cajero", "cocinero", "delivery"]}>
                        <Button variant="contained" color="secondary" size="small" sx={{ m: 0.5 }} onClick={handleDetalles}>Detalles</Button>
                    </ProtectedComponent>
                    <Button color="error" variant="contained" onClick={handlePdf}>Pdf</Button>
                </TableCell>
            </TableRow>
            <PedidoModal pedido={pedido} open={open} onClose={handleClose} />
        </>
    )
};

export default PedidosTable;