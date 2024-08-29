import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoriaGetDto from '../../../types/CategoriaGetDto';
import Categoria from '../../../types/Categoria';
import { CategoriaBaja, CategoriaDelete } from '../../../services/CategoriaService';
import CategoriaModal from './CategoriaModal';
import EliminarComponent from '../Advertencias/EliminarComponent';
import BajaSucursalComponent from '../Advertencias/BajaSucursal';
import { toast } from 'react-toastify';
import ProtectedComponent from '../../auth0/ProtectedComponent';
import { useAppSelector } from '../../../redux/hook';

interface CategoriaTableProps {
    onClose: () => void;
    categoria: CategoriaGetDto;
}

const CategoriaTable: React.FC<CategoriaTableProps> = ({ onClose, categoria }) => {
    const { getAccessTokenSilently } = useAuth0();
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const [open, setOpen] = useState(false);
    const [openEliminar, setOpenEliminar] = useState(false);
    const [openEliminarSub, setOpenEliminarSub] = useState(false);
    const [openBaja, setOpenBaja] = useState(false);
    const [openBajaSub, setOpenBajaSub] = useState(false);
    const [categoriaUpdate, setCategoriaUpdate] = useState<Categoria>(categoria);

    const bajaCategoria = async (idCategoria: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        if (sucursalRedux) {
            return CategoriaBaja(idCategoria, sucursalRedux?.id, token);
        }
    };

    const deleteCategoria = async (idCategoria: number) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return CategoriaDelete(idCategoria, token);
    };

    const handleEdit = (categoria: Categoria | CategoriaGetDto) => {
        setCategoriaUpdate(categoria);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    const handleDelete = async (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            try {
                const data = await deleteCategoria(categoria.id);
                if (data.status !== 200) {
                    toast.error(data.data.message, {
                        position: "top-right",
                        autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored"
                    });

                    return;
                }
            } catch (error) {
                console.log("Error al eliminar la categoria.");
            }
        }

        toast.success("Se elimino correctamente", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        handleClose();
        handleCloseDialog();
    }

    const handleBaja = async (categoria: Categoria | CategoriaGetDto) => {
        if (categoria.id !== null) {
            try {
                const data = await bajaCategoria(categoria.id);
                if (data && data.status !== 200) {
                    toast.error(data.data.message, {
                        position: "top-right",
                        autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored"
                    });

                    return;
                }
            } catch (error) {
                console.log("Error al dar de baja la categoria.");
            }
        }

        toast.success("Se dio de baja correctamente", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });

        handleClose();
    }

    const handleCloseDialog = () => {
        setOpenEliminar(false);
        setOpenEliminarSub(false);
        setOpenBaja(false);
        setOpenBajaSub(false);
    }

    const handleOpenEliminarDialog = () => {
        setOpenEliminar(true);
    }

    const handleOpenEliminarSubDialog = () => {
        setOpenEliminarSub(true);
    }

    const handleOpenBajaDialog = () => {
        setOpenBaja(true);
    }

    const handleOpenBajaSubDialog = () => {
        setOpenBajaSub(true);
    }

    const handleSuccess = () => {
        toast.success("Se actualizó correctamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            toastId: 'success-toast' // Asegura que el toast tenga un ID único
        });
    }

    const handleError = () => {
        toast.error("Error al actualizar la categoría, intente más tarde", {
            position: "top-right",
            autoClose: 5000, // Tiempo en milisegundos antes de que se cierre automáticamente
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }


    const filterSubCategoriasBySucursal = (subCategorias: CategoriaGetDto[] | null, idSucursal: number) => {
        return subCategorias ? subCategorias.filter(subCategoria =>
            subCategoria.sucursales?.some(sucursal => sucursal.id === idSucursal)
        ) : [];
    };

    const renderSubCategorias = (subCategorias: CategoriaGetDto[] | null) => {
        if (sucursalRedux) {
            const filteredSubCategorias = filterSubCategoriasBySucursal(subCategorias, sucursalRedux.id);
            return filteredSubCategorias.filter(subCategoria => !subCategoria.eliminado).map((subCategoria) => (
                <Box key={subCategoria.id} sx={{ paddingLeft: 1 }}>
                    <Accordion style={{ backgroundColor: "#c5c5c5" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{subCategoria.denominacion}</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Editar" arrow>
                                        <IconButton onClick={() => handleEdit(subCategoria)} color="primary"><EditIcon /></IconButton>
                                    </Tooltip>

                                    <Tooltip title="Dar de Baja" arrow>
                                        <IconButton onClick={handleOpenBajaSubDialog} color="secondary"><ArrowCircleDownIcon /></IconButton>
                                    </Tooltip>

                                    <Tooltip title="Eliminar" arrow>
                                        <IconButton onClick={handleOpenEliminarSubDialog} color="error"><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </ProtectedComponent>
                            </Box>
                        </AccordionSummary>
                        <EliminarComponent openDialog={openEliminarSub} onClose={handleCloseDialog} onConfirm={() => handleDelete(subCategoria)} tipo='la categoría' entidad={subCategoria} />
                        <BajaSucursalComponent openDialog={openBajaSub} onClose={handleCloseDialog} onConfirm={() => handleBaja(subCategoria)} tipo='la categoría' entidad={subCategoria} />
                        <AccordionDetails>
                            {renderSubCategorias(subCategoria.subCategorias)}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            ));
        }
    };

    return (
        <>
            <TableRow>
                <TableCell colSpan={2} style={{ padding: 0 }}>
                    <Accordion key={categoria.id} style={{ backgroundColor: "#c5c5c5" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{categoria.denominacion}{
                                categoria.esInsumo ?
                                    <Chip label="Insumo" size="small" color="secondary" sx={{ ml: 1 }} /> :
                                    <Chip label="Manufacturado" size="small" color="error" sx={{ ml: 1 }} />
                            }</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Editar" arrow>
                                        <IconButton onClick={() => handleEdit(categoria)} color="primary">{categoria.sucursales !== null && <EditIcon />}</IconButton>
                                    </Tooltip>
                                </ProtectedComponent>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Dar de Baja" arrow>
                                        <IconButton onClick={handleOpenBajaDialog} color="secondary"><ArrowCircleDownIcon /></IconButton>
                                    </Tooltip>
                                </ProtectedComponent>
                                <ProtectedComponent roles={['administrador', 'superadmin']}>
                                    <Tooltip title="Eliminar" arrow>
                                        <IconButton onClick={handleOpenEliminarDialog} color="error"><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </ProtectedComponent>
                            </Box>
                        </AccordionSummary>
                        <EliminarComponent openDialog={openEliminar} onClose={handleCloseDialog} onConfirm={() => handleDelete(categoria)} tipo='la categoría' entidad={categoria} />
                        <BajaSucursalComponent openDialog={openBaja} onClose={handleCloseDialog} onConfirm={() => handleBaja(categoria)} tipo='la categoría' entidad={categoria} />
                        <AccordionDetails>
                            {renderSubCategorias(categoria.subCategorias)}
                        </AccordionDetails>
                    </Accordion>
                </TableCell>
            </TableRow>

            <CategoriaModal open={open} onClose={handleClose} categoria={categoriaUpdate} success={handleSuccess} error={handleError} />
        </>
    )
};

export default CategoriaTable;