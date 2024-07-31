import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Categoria from "../../../types/Categoria";
import UnidadMedida from "../../../types/UnidadMedida";

interface EliminarComponentProps {
    openDialog: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tipo: string;
    entidad: Categoria | UnidadMedida
}

const EliminarComponent: React.FC<EliminarComponentProps> = ({ openDialog, onClose, onConfirm, tipo, entidad }) => {

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
                        ¿Está seguro que desea eliminar {tipo}: {entidad.denominacion}?
                    </DialogContentText>
                    {
                        tipo.includes("categoría") && (
                            <DialogContentText>
                                Esta acción afectara a todas las sucursales y subcategorias asociadas.
                            </DialogContentText>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default EliminarComponent;