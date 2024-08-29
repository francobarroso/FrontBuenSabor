import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import sizeConfigs from "../../configs/sizeConfig";
import colorConfigs from "../../configs/colorConfig";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SpeedIcon from '@mui/icons-material/Speed';
import avatarImage from '../../assets/images/logo.png'
import MonitorIcon from '@mui/icons-material/Monitor';
import ProtectedComponent from "../auth0/ProtectedComponent";

function SideBar() {
    const [openProducts, setOpenProducts] = useState(false);

    const handleProductsClick = () => {
        setOpenProducts(!openProducts);
    };

    return (
        <>
            <Drawer variant="permanent"
                sx={{
                    width: sizeConfigs.sidebar.width,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: sizeConfigs.sidebar.width,
                        boxSizing: "border-box",
                        borderRight: "0px",
                        backgroundColor: colorConfigs.sidebar.bg,
                        color: colorConfigs.sidebar.color
                    }
                }}
            >
                <List disablePadding>
                    <Toolbar sx={{ marginBottom: "20px" }}>
                        <Stack
                            sx={{ width: "100%" }}
                            direction="row"
                            justifyContent="center"
                        >
                            <Avatar src={avatarImage} sx={{ width: 70, height: 70 }} />
                        </Stack>
                    </Toolbar>

                    <ProtectedComponent roles={["administrador", "superadmin"]}>
                        <ListItemButton component={Link} to={"/estadisticas"}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <StackedBarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Estadisticas" />
                        </ListItemButton>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "admin", "cocinero", "cajero"]}>
                        <ListItemButton onClick={handleProductsClick}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <FoodBankIcon />
                            </ListItemIcon>
                            <ListItemText primary="Articulos" />
                            {openProducts ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openProducts} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={Link} to={"/manufacturados"} sx={{ pl: 4 }}>
                                    <ListItemIcon sx={{
                                        color: colorConfigs.sidebar.color
                                    }}>
                                        <FastfoodIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Manufacturados" />
                                </ListItemButton>
                                <ListItemButton component={Link} to={"/insumos"} sx={{ pl: 4 }}>
                                    <ListItemIcon sx={{
                                        color: colorConfigs.sidebar.color
                                    }}>
                                        <ShoppingCartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Insumos" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "admin", "cocinero", "cajero"]}>
                        <ListItemButton component={Link} to={"/categorias"}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Categorías" />
                        </ListItemButton>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "admin", "cocinero", "cajero"]}>
                        <ListItemButton component={Link} to={"/promociones"}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <AttachMoneyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Promociones" />
                        </ListItemButton>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin"]}>
                        <ListItemButton component={Link} to={"/empleados"}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Empleados" />
                        </ListItemButton>
                    </ProtectedComponent>
                    <ProtectedComponent roles={["superadmin", "admin", "cocinero"]}>
                        <ListItemButton component={Link} to={"/unidad-medida"}>
                            <ListItemIcon sx={{
                                color: colorConfigs.sidebar.color
                            }}>
                                <SpeedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Unidad de Medida" />
                        </ListItemButton>
                    </ProtectedComponent>
                    <ListItemButton component={Link} to={"/pedidos"}>
                        <ListItemIcon sx={{
                            color: colorConfigs.sidebar.color
                        }}>
                            <MonitorIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pedidos" />
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    )
}

export default SideBar;