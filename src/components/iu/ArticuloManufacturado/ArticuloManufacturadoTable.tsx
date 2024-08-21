import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import { useState } from "react";
import Imagen from "../../../types/Imagen";
import { useAuth0 } from "@auth0/auth0-react";
import { Chip, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ArticuloManufacturadoDetalle from "../../../types/ArticuloManufacturadoDetalle";
import { ArticuloManufacturadoUpdate } from "../../../services/ArticuloManufacturadoService";
import ArticuloManufacturadoViewModal from "./ArticuloManufacturadoViewModal";
import ArticuloManufacturadoAddModal from "./ArticuloManufacturadoAddModal";
import DesactivarComponent from "../Advertencias/DesactivarComponent";
import ActivarComponent from "../Advertencias/ActivarComponent";
import { toast } from "react-toastify";
import ProtectedComponent from "../../auth0/ProtectedComponent";

interface ArticuloManufacturadoTableProps {
    onClose: () => void;
    articulo: ArticuloManufacturado;
}

const ArticuloManufacturadoTable: React.FC<ArticuloManufacturadoTableProps> = ({ onClose, articulo }) => {
    const [view, setView] = useState(false);
    const [openBaja, setOpenBaja] = useState(false);
    const [openAlta, setOpenAlta] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [articuloImages, setArticuloImages] = useState<Imagen[]>(articulo.imagenes);
    const [openModal, setOpenModal] = useState(false);
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const { getAccessTokenSilently } = useAuth0();

    const updateArticuloManufacturado = async (articulo: ArticuloManufacturado) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        return ArticuloManufacturadoUpdate(articulo, token);
    };


    const handleOpenEditModal = async (articulo: ArticuloManufacturado) => {
        if (articulo) {
            if (articulo.articuloManufacturadoDetalles !== null) {
                setDetalles(articulo.articuloManufacturadoDetalles);
            }
            setImages(articulo.imagenes.map(imagen => imagen.url));
            setArticuloImages(articulo.imagenes);
        }

        setOpenModal(true);
    }

    const handleView = (articulo?: ArticuloManufacturado) => {
        if (articulo) {
            setImages(articulo.imagenes.map(imagen => imagen.url));
        }

        setView(true);
    };


    const handleBaja = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = false;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = true;
                toast.error(data.responseData.message, {
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
            console.log("Error al dar de baja un articulo manufacturado");
        }

        toast.success("Se deshabilitó correctamente", {
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

    const handleAlta = async (articulo: ArticuloManufacturado) => {
        articulo.habilitado = true;
        try {
            const data = await updateArticuloManufacturado(articulo);
            if (data.status !== 200) {
                articulo.habilitado = false;
                toast.error("No se pudo habilitar el articulo, intente más tarde", {
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
            console.log("Error al dar de baja un articulo manufacturado");
        }

        toast.success("Se habilitó el articulo", {
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

    const handleClose = () => {
        setOpenModal(false);
        setView(false);
        onClose();
    }

    const handleOpenBaja = () => {
        setOpenBaja(true);
    }

    const handleOpenAlta = () => {
        setOpenAlta(true);
    }

    const handleCloseDialog = () => {
        setOpenBaja(false);
        setOpenAlta(false);
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
        toast.error("Error al actualizar el manufacturado, intente más tarde", {
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

    return (
        <>
            <TableRow sx={{ backgroundColor: articulo.habilitado === true ? "none" : "#788293" }} key={articulo.id}>
                <TableCell align="center">{articulo.denominacion}</TableCell>
                <TableCell align="center">
                    <Chip
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                        label={articulo.unidadMedida.denominacion}
                    />
                </TableCell>
                <TableCell align="center">${articulo.precioVenta}</TableCell>
                <TableCell align="center">{articulo.tiempoEstimadoMinutos}</TableCell>
                <TableCell align="center">
                    <Chip
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                        label={articulo.categoria?.denominacion}
                    />
                </TableCell>
                {
                    articulo.habilitado === true ?
                        <TableCell align="center">
                            <ProtectedComponent roles={['administrador', 'superadmin']}>
                                <Tooltip title="Editar" arrow>
                                    <IconButton aria-label="edit" onClick={() => handleOpenEditModal(articulo)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </ProtectedComponent>

                            <Tooltip title="Ver Manufacturado" arrow>
                                <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>

                            <ProtectedComponent roles={['administrador', 'superadmin']}>
                                <Tooltip title="Deshabilitar" arrow>
                                    <IconButton aria-label="baja" onClick={handleOpenBaja} color="error">
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </ProtectedComponent>

                        </TableCell>
                        :
                        <TableCell align="center">
                            <Tooltip title="Ver Manufacturado" arrow>
                                <IconButton aria-label="view" onClick={() => handleView(articulo)} color="secondary">
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>

                            <ProtectedComponent roles={['administrador', 'superadmin']}>
                                <Tooltip title="Habilitar" arrow>
                                    <IconButton aria-label="alta" onClick={handleOpenAlta} color="success">
                                        <KeyboardDoubleArrowUpIcon />
                                    </IconButton>
                                </Tooltip>
                            </ProtectedComponent>
                        </TableCell>
                }
            </TableRow>

            <ArticuloManufacturadoViewModal view={view} onClose={handleClose} articulo={articulo} images={images} />
            <ArticuloManufacturadoAddModal open={openModal} onClose={handleClose} articulo={articulo} imagenes={images} articuloImagenes={articuloImages} articuloDetalles={detalles} success={handleSuccess} error={handleError} />
            <DesactivarComponent openDialog={openBaja} onClose={handleCloseDialog} onConfirm={() => handleBaja(articulo)} tipo='el manufacturado' entidad={articulo} />
            <ActivarComponent openDialog={openAlta} onClose={handleCloseDialog} onConfirm={() => handleAlta(articulo)} tipo='el manufacturado' entidad={articulo} />
        </>
    )
};

export default ArticuloManufacturadoTable;