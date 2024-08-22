import { Route, Routes } from "react-router-dom";
import Ingreso from "../screens/Ingreso";
import PreLayout from "../components/layout/PreLayout";
import ProtectedRoute from "../components/auth0/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../screens/Dashboard";
import Empresa from "../screens/EmpresaList";
import Sucursal from "../screens/SucursalList";
import EmpleadosList from "../screens/EmpleadosList";
import ArticuloManufacturadoList from "../screens/ArticuloManufacturadoList";
import CategoriaList from "../screens/CategoriaList";
import PromocionList from "../screens/PromocionList";
import ArticuloInsumoList from "../screens/ArticuloInsumoList";
import UnidadMedidaList from "../screens/UnidadMedidaList";
import PedidosList from "../screens/PedidosList";

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Ingreso />}></Route>
            <Route element={<PreLayout />}>
                <Route element={<ProtectedRoute roles={['administrador', 'superadmin']} />}>
                    <Route path="/empresa" element={<Empresa />} />
                    <Route path="empresa/:idEmpresa" element={<Sucursal />} />
                </Route>
            </Route>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute roles={['superadmin', 'administrador']} />}>
                    <Route path="estadisticas/:idEmpresa/:idSucursal" element={<Dashboard />} />
                </Route>
                <Route element={<ProtectedRoute roles={['superadmin']} />}>
                    <Route path="empleados/:idEmpresa/:idSucursal" element={<EmpleadosList />} />
                </Route>
                <Route element={<ProtectedRoute roles={['superadmin', 'administrador', 'cocinero']} />}>
                    <Route path="manufacturados/:idEmpresa/:idSucursal" element={<ArticuloManufacturadoList />} />
                    <Route path="categorias/:idEmpresa/:idSucursal" element={<CategoriaList />} />
                    <Route path="promociones/:idEmpresa/:idSucursal" element={<PromocionList />} />
                    <Route path="insumos/:idEmpresa/:idSucursal" element={<ArticuloInsumoList />} />
                    <Route path="unidad-medida/:idEmpresa/:idSucursal" element={<UnidadMedidaList />} />
                </Route >

                <Route element={<ProtectedRoute roles={['administrador', 'superadmin', 'cocinero', 'delivery', 'cajero']} />}>
                    <Route path="pedidos/:idEmpresa/:idSucursal" element={<PedidosList />} />
                </Route>
            </Route>
        </Routes>
    );
}