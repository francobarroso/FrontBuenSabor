import { Container, Typography, Box } from "@mui/material";
import LoginButton from "../components/common/LoginButton";
import ingresoImage from '../assets/images/ingreso.jpg'

const Ingreso = () => {

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
      </Container>
    );
  };
  
  export default Ingreso;