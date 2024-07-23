import { AppBar, Toolbar, Typography, Box, Select, MenuItem, FormControl, SelectChangeEvent, Avatar, Stack, ListItemButton, ListItemText } from "@mui/material";
import colorConfigs from "../../configs/colorConfig";
import sizeConfigs from "../../configs/sizeConfig";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import Sucursal from "../../types/Sucursal";
import { SucursalGetByEmpresaId } from "../../services/SucursalService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import avatarImage from '../../assets/images/logo.png'


const Topbar = () => {
  const { isAuthenticated } = useAuth0();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const { idEmpresa, idSucursal } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently } = useAuth0();

  const getAllSucursal = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const sucursales: Sucursal[] = await SucursalGetByEmpresaId(Number(idEmpresa), token);
    setSucursales(sucursales);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const newSucursalId = event.target.value;
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/");
    pathSegments[pathSegments.length - 1] = newSucursalId;
    const newPath = pathSegments.join("/");
    navigate(newPath);
  };

  useEffect(() => {
    getAllSucursal();
  }, []);

  const isSucursalOrEmpresa = location.pathname.includes('empresa');
  const showSucursalSelect = location.pathname.includes('inicio');

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 0)`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        borderBottomLeftRadius: '20px', // Ajusta este valor según lo necesario
        borderBottomRightRadius: '20px' // Ajusta este valor según lo necesario
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative"
        }}
      >
        <Typography variant="h6"></Typography>

        {
          showSucursalSelect ? (
            <Toolbar sx={{ marginBottom: "7px", marginTop: "5px" }}>
              <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="right"


              >
                <Avatar src={avatarImage} sx={{ width: 70, height: 70 }} />
                <Typography variant="h5" noWrap style={{ cursor: 'pointer', marginLeft: '20px', alignContent: 'center', color: '#EEEEEE', fontWeight: 'bold', letterSpacing: '3px', fontFamily: 'Cascadia code, sans-serif' }} onClick={() => window.location.href = '/inicio'}>
                  El Buen Sabor|
                </Typography>

              </Stack>
              <ListItemButton onClick={() => window.location.href = '/menu'}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Cambia el color de fondo al hacer hover
                  }
                }}
              >
                <ListItemText
                  primary="MENÚ"
                  primaryTypographyProps={{
                    style: {
                      fontSize: '15px',
                      fontWeight: 'bold',
                      fontFamily: 'century, sans-serif',
                      marginRight: '5px'

                    }
                  }}
                />
              </ListItemButton>
            </Toolbar>
          ) : (!isSucursalOrEmpresa && (
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
                  value={idSucursal || ''}
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
          )
          )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%"
          }}
        >
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <LoginButton />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;