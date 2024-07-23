import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Promocion from "../../../types/Promocion";
import ArticuloInsumo from "../../../types/ArticuloInsumo";
import ArticuloManufacturado from "../../../types/ArticuloManufacturado";

interface ActivarComponentProps {
    openDialog: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tipo: string;
    entidad: Promocion | ArticuloInsumo | ArticuloManufacturado
}

const ActivarComponent: React.FC<ActivarComponentProps> = ({ openDialog, onClose, onConfirm, tipo, entidad }) => {

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
                        ¿Activar {tipo}: {entidad.denominacion}?
                    </DialogContentText>
                    <DialogContentText>
                        Esta acción afectara a todas las sucursales.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="success" variant="contained" autoFocus>
                        Activar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ActivarComponent;