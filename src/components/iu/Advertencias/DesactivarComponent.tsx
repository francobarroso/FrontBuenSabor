import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Promocion from "../../../types/Promocion";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import Empleado from "../../../types/Empleado";

interface DesactivarComponentProps {
    openDialog: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tipo: string;
    entidad: Promocion | ArticuloInsumo | ArticuloManufacturado | Empleado
}

const DesactivarComponent: React.FC<DesactivarComponentProps> = ({ openDialog, onClose, onConfirm, tipo, entidad }) => {

    const handleClose = () => {
        onClose();
    }

    const handleConfirmDelete = () => {
        onConfirm();
    }

    return (
        <>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Confirmar Acción</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea desactivar {tipo}: {'denominacion' in entidad ? entidad.denominacion : entidad.nombre}?
                    </DialogContentText>

                    {'denominacion' in entidad && (
                        <DialogContentText>
                            Esta acción afectara a todas las sucursales.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Desactivar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DesactivarComponent;