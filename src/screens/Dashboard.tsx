import SideBar from "../components/common/SideBar";
import { Chart } from 'react-google-charts';
import { GananciaGetByFecha, ProductosGetByFecha, TotalGetByFecha } from "../services/PedidoService";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Tooltip, Typography } from "@mui/material";
import colorConfigs from "../configs/colorConfig";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAppSelector } from "../redux/hook";
import ExcelImage from "../assets/images/excel.png";
import { ReporteGanancias, ReporteProductos } from "../services/Reportes";

export const getStartOfYear = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
};

export const getEndOfYear = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
};

function Dashboard() {
    const [ganancia, setGanancia] = useState<Object[]>([]);
    const [productos, setProductos] = useState<Object[]>([]);
    const [startDate, setStartDate] = useState(getStartOfYear());
    const [endDate, setEndDate] = useState(getEndOfYear());
    const [totalHoy, setTotalHoy] = useState(0);
    const [totalSemana, setTotalSemana] = useState(0);
    const [totalMes, setTotalMes] = useState(0);
    const sucursalRedux = useAppSelector((state) => state.sucursal.sucursal);

    const getGanancias = async (startDate: string, endDate: string) => {
        if (sucursalRedux) {
            const data: Object[] = await GananciaGetByFecha(startDate, endDate, sucursalRedux.id);
            const formatedData: Object[] = [];
            formatedData.push(["", "Ganancia Mensual"]);
            formatedData.push(...data);
            setGanancia(formatedData);
        }
    }

    const reporteGanancia = async (startDate: string, endDate: string) => {
        if (sucursalRedux) {
            await ReporteGanancias(startDate, endDate, sucursalRedux.id);
        }
    }

    const reporteProductos = async (startDate: string, endDate: string) => {
        if (sucursalRedux) {
            await ReporteProductos(startDate, endDate, sucursalRedux.id);
        }
    }

    const getProductos = async (startDate: string, endDate: string) => {
        if (sucursalRedux) {
            const data: Object[] = await ProductosGetByFecha(startDate, endDate, sucursalRedux.id);
            const formatedData: Object[] = [];
            formatedData.push(["", ""]);
            formatedData.push(...data);
            setProductos(formatedData);
        }
    }

    const getTotal = useCallback(async (startDate: string, endDate: string, setTotal: (value: number) => void) => {
        if (sucursalRedux) {
            try {
                const value: number = await TotalGetByFecha(startDate, endDate, sucursalRedux.id);
                setTotal(value);
            } catch (error) {
                console.error("Failed to fetch total:", error);
                setTotal(0); // Establece un valor predeterminado o muestra un mensaje de error
            }
        }
    }, [sucursalRedux]);

    const handleExcelGanancia = () => {
        reporteGanancia(startDate, endDate);
    }

    const handleExcelProductos = () => {
        reporteProductos(startDate, endDate);
    }

    const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };

    const handleFilter = () => {
        getGanancias(startDate, endDate);
        getProductos(startDate, endDate);
    }

    useEffect(() => {
        getGanancias(startDate, endDate);
        getProductos(startDate, endDate);

        const today = new Date();
        const dayOfWeek = today.getDay();

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        getTotal(today.toISOString().split('T')[0], today.toISOString().split('T')[0], setTotalHoy);
        getTotal(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0], setTotalSemana);
        getTotal(monthStart.toISOString().split('T')[0], monthEnd.toISOString().split('T')[0], setTotalMes);
    }, [sucursalRedux]);

    return (
        <>
            <SideBar />
            <Box mt={3} ml={3} mr={3}>
                <Box mb={2}
                    sx={{
                        backgroundColor: "#c5c5c5",
                        borderRadius: "20px",
                        p: 2,
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                type="date"
                                value={startDate}
                                onChange={handleStartChange}
                            />
                            <TextField
                                type="date"
                                value={endDate}
                                onChange={handleEndChange}
                            />
                            <Button variant="contained" sx={{ ...colorConfigs.buttonStyles }} onClick={handleFilter}>
                                Filtrar
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={2} ml="auto">
                            <Box sx={{ backgroundColor: "white", p: 1, borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <CalendarTodayIcon sx={{ width: '30px' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${totalHoy}</Typography>
                                </Box>
                                <Typography>Recaudado hoy</Typography>
                            </Box>
                            <Box sx={{ backgroundColor: "white", p: 1, borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <DateRangeIcon />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${totalSemana}</Typography>
                                </Box>
                                <Typography>Recaudado esta semana</Typography>
                            </Box>
                            <Box sx={{ backgroundColor: "white", p: 1, borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <CalendarMonthIcon />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>${totalMes}</Typography>
                                </Box>
                                <Typography>Recaudado este mes</Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt={3}>
                    <Box sx={{ flex: 1, mr: 1, borderRadius: "20px", border: '1px solid #c5c5c5', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'end', mb: 2 }}>
                            {ganancia.length > 1 && (
                                <Tooltip title="Descargar Excel" arrow>
                                    <img
                                        src={ExcelImage}
                                        alt="ganancias"
                                        style={{ width: 30, height: 30, cursor: "pointer", marginRight: 8 }}
                                        onClick={handleExcelGanancia}
                                    />
                                </Tooltip>
                            )}
                            <Typography variant="h6">Ganancias</Typography>
                        </Box>
                        {ganancia.length > 1 ? (
                            <Chart
                                chartType="Bar"
                                width="100%"
                                height="400px"
                                data={ganancia}
                            />
                        ) : (
                            <Typography variant="body1">No hay datos para mostrar</Typography>
                        )}
                    </Box>
                    <Box sx={{ flex: 1, mr: 1, borderRadius: "20px", border: '1px solid #c5c5c5', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'end', mb: 2 }}>
                            {productos.length > 1 && (
                                <Tooltip title="Descargar Excel" arrow>
                                    <img
                                        src={ExcelImage}
                                        alt="ganancias"
                                        style={{ width: 30, height: 30, cursor: "pointer", marginRight: 8 }}
                                        onClick={handleExcelProductos}
                                    />
                                </Tooltip>
                            )}
                            <Typography variant="h6">Productos más vendidos</Typography>
                        </Box>
                        {productos.length > 1 ? (
                            <Chart
                                chartType="PieChart"
                                data={productos}
                                width="100%"
                                height="400px"
                            />
                        ) : (
                            <Typography variant="body1">No hay datos para mostrar</Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Dashboard;