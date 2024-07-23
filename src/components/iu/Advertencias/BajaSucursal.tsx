import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Categoria from "../../../types/Categoria";
import CategoriaGetDto from "../../../types/CategoriaGetDto";

interface BajaSucursalComponentProps {
    openDialog: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tipo: string;
    entidad: Categoria | CategoriaGetDto
}

const BajaSucursalComponent: React.FC<BajaSucursalComponentProps> = ({ openDialog, onClose, onConfirm, tipo, entidad }) => {

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
                        ¿Está seguro que desea dar de baja {tipo} {entidad.denominacion} de esta sucursal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Dar de Baja
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BajaSucursalComponent;