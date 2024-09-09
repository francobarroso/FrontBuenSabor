import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, Modal, TextField, Tooltip, Typography } from "@mui/material";
import Categoria from "../../../types/Categoria";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Sucursal from "../../../types/Sucursal";
import { useAuth0 } from "@auth0/auth0-react";
import { SucursalGetByEmpresaId } from "../../../services/SucursalService";
import { CategoriaCreate, CategoriaUpdate } from "../../../services/CategoriaService";
import colorConfigs from "../../../configs/colorConfig"
import { useAppSelector } from "../../../redux/hook";

const emptyCategoria = { id: null, eliminado: false, denominacion: '', esInsumo: false, sucursales: [], subCategorias: [] };

interface CategoriaModalProps {
    open: boolean;
    onClose: () => void;
    categoria: Categoria;
    success: () => void;
    error: () => void;
}

const CategoriaModal: React.FC<CategoriaModalProps> = ({ open, onClose, categoria, success, error }) => {
    const [currentCategoria, setCurrentCategoria] = useState<Categoria>(categoria);
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const getAllSucursal = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });
        if (empresaRedux) {
            const sucursales: Sucursal[] = await SucursalGetByEmpresaId(empresaRedux.id, token);
            setSucursales(sucursales);
        }
    };

    const createCategoria = async (categoria: Categoria) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return CategoriaCreate(categoria, token);
    };

    const updateCategoria = async (categoria: Categoria) => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
        });

        return CategoriaUpdate(categoria, token);
    };

    useEffect(() => {
        getAllSucursal();
    }, [empresaRedux]);

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Limitar a 20 caracteres y permitir solo letras
        const regex = /^[A-Za-z]{0,25}$/;
        if (regex.test(value)) {
            setCurrentCategoria({ ...currentCategoria, [name]: value });
            if (errors[name]) {
                setErrors({ ...errors, [name]: '' });
            }
        }
    };

    const handleEsInsumoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentCategoria({ ...currentCategoria, esInsumo: e.target.checked });
    };

    const handleSucursalChange = (id: number) => {
        const sucursalesSeleccionadas = currentCategoria.sucursales || [];
        const sucursalExistente = sucursalesSeleccionadas.find(s => s.id === id);

        if (sucursalExistente) {
            setCurrentCategoria({
                ...currentCategoria,
                sucursales: sucursalesSeleccionadas.filter(s => s.id !== id)
            });
        } else {
            const sucursal = sucursales.find(s => s.id === id);
            if (sucursal) {
                setCurrentCategoria({
                    ...currentCategoria,
                    sucursales: [...sucursalesSeleccionadas, sucursal]
                });
            }
        }

        if (errors.sucursales) {
            setErrors({ ...errors, sucursales: '' });
        }
    };

    const handleAddSubCategoria = () => {
        setCurrentCategoria({
            ...currentCategoria,
            subCategorias: [...(currentCategoria.subCategorias || []), { ...emptyCategoria }]
        });
    };

    const handleSubCategoriaChange = (index: number, denominacion: string) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        const regex = /^[A-Za-z]{0,25}$/;
        if (regex.test(denominacion)) {
            subCategorias[index].denominacion = denominacion;
            setCurrentCategoria({ ...currentCategoria, subCategorias });
            if (errors[`subCategoria-${index}`]) {
                setErrors({ ...errors, [`subCategoria-${index}`]: '' });
            }
        }
    };

    const handleRemoveSubCategoria = (index: number) => {
        const subCategorias = [...(currentCategoria.subCategorias || [])];
        subCategorias.splice(index, 1);
        setCurrentCategoria({ ...currentCategoria, subCategorias });
    };

    const handleClose = () => {
        setCurrentCategoria(categoria);
        setErrors({});
        onClose();
    }

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!currentCategoria.denominacion) {
            newErrors.denominacion = 'La denominación es obligatoria.';
        }
        if (!currentCategoria.sucursales || currentCategoria.sucursales.length === 0) {
            newErrors.sucursales = 'Debe seleccionar al menos una sucursal.';
        }
        if (currentCategoria.subCategorias) {
            currentCategoria.subCategorias.forEach((subCategoria, index) => {
                if (!subCategoria.denominacion) {
                    newErrors[`subCategoria-${index}`] = 'La denominación de la subcategoría es obligatoria.';
                }
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        if (currentCategoria.id === null) {
            try {
                const data = await createCategoria(currentCategoria);
                if (data.status !== 200) {
                    error();
                    return;
                }

            } catch (error) {
                console.log("No se pudo crear la categoría.");
            }
        } else {
            if (currentCategoria.subCategorias !== null) {
                let subcategorias: Categoria[] = currentCategoria.subCategorias;
                for (let i = 0; i < subcategorias.length; i++) {
                    subcategorias[i].sucursales = currentCategoria.sucursales;
                }
            }

            try {
                const data = await updateCategoria(currentCategoria);
                if (data.status !== 200) {
                    error();
                    return;
                }

            } catch (error) {
                console.log("Error al actualizar la categoría.");
            }
        }

        success();
        handleClose();
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: 700, maxHeight: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflowY: 'auto' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        {currentCategoria.id === null ? 'Crear Categoría' : 'Editar Categoría'}
                    </Typography>
                    <Grid container spacing={2} mb={2}>
                        <Grid item xs={8}>
                            <FormControl fullWidth error={!!errors.denominacion}>
                                <TextField
                                    fullWidth
                                    label="Denominación"
                                    name="denominacion"
                                    value={currentCategoria.denominacion}
                                    onChange={handleCategoriaChange}
                                    margin="normal"
                                />
                                {errors.denominacion && <FormHelperText>{errors.denominacion}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} container justifyContent="center" alignItems="center">
                            {
                                categoria.id !== null && categoria.id > 0 ?
                                    <Tooltip title="No se puede modificar esta opción." arrow>
                                        <FormControl fullWidth>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={currentCategoria.esInsumo}
                                                        onChange={handleEsInsumoChange}
                                                        name="esInsumo"
                                                        color="primary"
                                                        disabled={categoria.id !== null && categoria.id > 0}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: "#233044"
                                                            },
                                                            '&.Mui-disabled': {
                                                                color: 'rgba(0, 0, 0, 0.38)',
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'rgba(0, 0, 0, 0.38)',
                                                                },
                                                            },
                                                            '&.Mui-disabled.Mui-checked': {
                                                                color: 'rgba(0, 0, 0, 0.38)',
                                                            }
                                                        }}
                                                    />
                                                }
                                                label="Es Insumo"
                                            />
                                        </FormControl>
                                    </Tooltip>
                                    :
                                    <FormControl fullWidth>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={currentCategoria.esInsumo}
                                                    onChange={handleEsInsumoChange}
                                                    name="esInsumo"
                                                    disabled={categoria.id !== null && categoria.id > 0}
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: "#233044"
                                                        },
                                                        '&.Mui-disabled': {
                                                            color: 'rgba(0, 0, 0, 0.38)',
                                                            '& .MuiSvgIcon-root': {
                                                                color: 'rgba(0, 0, 0, 0.38)',
                                                            },
                                                        },
                                                        '&.Mui-disabled.Mui-checked': {
                                                            color: 'rgba(0, 0, 0, 0.38)',
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Es Insumo"
                                        />
                                    </FormControl>
                            }
                        </Grid>
                    </Grid>

                    <Box mb={2}>
                        <FormControl error={!!errors.sucursales}>
                            <Typography variant="subtitle1" gutterBottom>
                                Seleccione la/s sucursales:
                            </Typography>
                            {sucursales.map((sucursal) => {
                                const isDisabled = categoria.sucursales?.some((s) => s.id === sucursal.id) || false;
                                return (
                                    <Tooltip
                                        key={sucursal.id}
                                        title={isDisabled ? "Si se desea dar de baja de esta sucursal hay un botón para ello en el apartado de acciones." : ""}
                                        arrow
                                    >
                                        <span>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={currentCategoria.sucursales?.some((s) => s.id === sucursal.id) || false}
                                                        onChange={() => handleSucursalChange(sucursal.id)}
                                                        disabled={isDisabled}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: "#233044"
                                                            },
                                                            '&.Mui-disabled': {
                                                                color: 'rgba(0, 0, 0, 0.38)',
                                                                '& .MuiSvgIcon-root': {
                                                                    color: 'rgba(0, 0, 0, 0.38)',
                                                                },
                                                            },
                                                            '&.Mui-disabled.Mui-checked': {
                                                                color: 'rgba(0, 0, 0, 0.38)',
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={sucursal.nombre}
                                            />
                                        </span>
                                    </Tooltip>
                                );
                            })}
                            {errors.sucursales && <FormHelperText>{errors.sucursales}</FormHelperText>}
                        </FormControl>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Agregar Subcategorías
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleAddSubCategoria}
                            style={{ marginLeft: 10 }}
                            sx={{
                                color: "#233044",
                                borderColor: "#233044",
                                borderWidth: 2, // Grosor del contorno
                                fontWeight: 'bold', // Grosor del texto
                                '&:hover': {
                                    borderColor: "#48576f",
                                    backgroundColor: 'transparent',
                                    color: "#48576f",
                                    borderWidth: 2, // Grosor del contorno
                                    fontWeight: 'bold' // Grosor del texto
                                }
                            }}
                        >
                            Agregar
                        </Button>
                    </Box>
                    {currentCategoria.subCategorias && currentCategoria.subCategorias.map((subCategoria, index) => (
                        <Box key={index} display="flex" alignItems="center" mt={2}>
                            <FormControl error={!!errors[`subCategoria-${index}`]}>
                                <TextField
                                    label="Denominación"
                                    value={subCategoria.denominacion}
                                    onChange={(e) => handleSubCategoriaChange(index, e.target.value)}
                                    margin="normal"
                                />
                                {errors[`subCategoria-${index}`] && <FormHelperText>{errors[`subCategoria-${index}`]}</FormHelperText>}
                            </FormControl>
                            {
                                subCategoria.id === null &&
                                <IconButton sx={{ color: "#233044" }} onClick={() => handleRemoveSubCategoria(index)}>
                                    <CloseIcon />
                                </IconButton>
                            }
                        </Box>
                    ))}
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={handleSubmit} sx={{ ...colorConfigs.buttonStyles }}>
                            {currentCategoria.id === null ? 'Crear Categoría' : 'Actualizar Categoría'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CategoriaModal;
