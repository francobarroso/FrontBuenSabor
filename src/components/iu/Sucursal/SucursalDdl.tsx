import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import Sucursal from "../../../types/Sucursal";
import { useEffect, useState } from "react";
import { SucursalGetByEmpresaId } from "../../../services/SucursalService";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { setSucursal } from "../../../redux/slices/sucursalSlice";

const SucursalDdl: React.FC = () => {
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const empresaRedux = useAppSelector((state) => state.empresa.empresa);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
    
      const handleChange = (event: SelectChangeEvent) => {
        const newSucursalId = event.target.value;
        const sucursal = sucursales.find(sucursal => sucursal.id === Number(newSucursalId));
        if(sucursal) dispatch(setSucursal(sucursal));
        const currentPath = window.location.pathname;
        navigate(currentPath);
      };

    const isSucursalOrEmpresa = location.pathname.includes('empresas') || location.pathname.includes('sucursales');

    useEffect(() => {
      if(!isSucursalOrEmpresa) getAllSucursal();
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            >
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                        sx={{ backgroundColor: 'white' }}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={sucursalRedux?.id.toString() || ''}
                        onChange={handleChange}
                    >
                        {sucursales.filter(sucursal => !sucursal.eliminado).map((sucursal) => (
                            <MenuItem key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </>
    )
}

export default SucursalDdl;