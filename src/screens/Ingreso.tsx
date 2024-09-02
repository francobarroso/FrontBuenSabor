import { Container, Typography, Box, Button } from "@mui/material";
import LoginButton from "../components/common/LoginButton";
import ingresoImage from '../assets/images/ingreso.jpg'
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { EmpleadoGetByEmail } from "../services/EmpleadoService";
import { setUser } from "../redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { useNavigate } from "react-router-dom";
import colorConfigs from "../configs/colorConfig";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { EmpresaGetBySucursal } from "../services/EmpresaService";
import { setEmpresa } from "../redux/slices/empresaSlice";
import { SucursalGetById } from "../services/SucursalService";
import { setSucursal } from "../redux/slices/sucursalSlice";

const Ingreso = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const empleado = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const getEmpresaBySucursal = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    if (empleado?.sucursal) {
      return await EmpresaGetBySucursal(empleado.sucursal.id, token);
    }
  }

  const getSucursalById = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    if (empleado?.sucursal) {
      return await SucursalGetById(empleado.sucursal.id, token);
    }
  }

  const handleIngresar = () => {
    switch (empleado?.usuario.rol) {
      case "SUPERADMIN":
        navigate('/empresas');
        break;
      case "ADMIN":
        navigate('/sucursales');
        break;
      case "CAJERO":
        navigate('/pedidos');
        break;
      case "COCINERO":
        navigate('/pedidos');
        break;
      case "DELIVERY":
        navigate('/pedidos');
        break;
      default:
        navigate('/unauthorized');
        break;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const traerEmpleado = async (email: string) => {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });
        const empleado = await EmpleadoGetByEmail(email, token);
        if (empleado) {
          dispatch(setUser(empleado.data));
          const empresa = await getEmpresaBySucursal();
          if (empresa) dispatch(setEmpresa(empresa));
          const sucursal = await getSucursalById();
          if (sucursal) dispatch(setSucursal(sucursal));
        }
      }
      if (isAuthenticated && user?.email) {
        traerEmpleado(user.email);
      }
    }
  }, [isAuthenticated]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {!isAuthenticated ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Box
            component="img"
            src={ingresoImage}
            alt="Ingreso"
            sx={{ width: "100%", mb: 2, borderRadius: 2 }}
          />
          <LoginButton />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            ¡Bienvenido {empleado?.nombre}!
          </Typography>
          <Box
            component="img"
            src={ingresoImage}
            alt="Ingreso"
            sx={{ width: "100%", mb: 2, borderRadius: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleIngresar}
            sx={{ ...colorConfigs.buttonIngresar }}
          >
            <AccountCircleIcon /> Ingresar
          </Button>
        </Box>
      )

      }
    </Container>
  );
};

export default Ingreso;