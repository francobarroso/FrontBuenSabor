import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: '/empresa',
          },
        })
      }
    >
     <AccountCircleIcon/> Ingresar
    </Button>
  );
};

export default LoginButton;
