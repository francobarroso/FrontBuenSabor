import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Menu, MenuItem, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const LogoutButton = () => {
  const { user, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    navigate('/');
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={handleClick}
      >
        <Avatar
          src={user?.picture}
          alt={user?.name}
          sx={{ width: 30, height: 30, mr: 2 }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">{user?.name}</Typography>
          <KeyboardArrowDownIcon sx={{ width: "17px", ml: 0.9 }} />
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>
          <ExitToAppIcon /> Cerrar Sesión
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LogoutButton;
