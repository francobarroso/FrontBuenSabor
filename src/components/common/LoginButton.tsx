import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import colorConfigs from "../../configs/colorConfig";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: '/empresa',
          },
        })
      }
      sx={{...colorConfigs.buttonIngresar}}
    >
     <AccountCircleIcon/> Ingresar
    </Button>
  );
};

export default LoginButton;
