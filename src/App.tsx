import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./screens/Dashboard";
import Categoria from "./screens/CategoriaList";
import ArticuloManufacturado from "./screens/ArticuloManufacturadoList";
import Promocion from "./screens/PromocionList";
import Empleado from "./screens/EmpleadosList";
import ArticuloInsumo from "./screens/ArticuloInsumoList";
import UnidadMedida from "./screens/UnidadMedidaList";
import Empresa from "./screens/EmpresaList";
import Sucursal from "./screens/SucursalList";
import PreLayout from "./components/layout/PreLayout";
import PedidosList from "./screens/PedidosList";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./components/auth0/ProtectedRoute";
import Loading from "./screens/Loading";
import Ingreso from "./screens/Ingreso";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />
  }

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
          <Route path="empleados/:idEmpresa/:idSucursal" element={<Empleado />} />
        </Route>
        <Route element={<ProtectedRoute roles={['superadmin', 'administrador', 'cocinero']} />}>
          <Route path="manufacturados/:idEmpresa/:idSucursal" element={<ArticuloManufacturado />} />
          <Route path="categorias/:idEmpresa/:idSucursal" element={<Categoria />} />
          <Route path="promociones/:idEmpresa/:idSucursal" element={<Promocion />} />
          <Route path="insumos/:idEmpresa/:idSucursal" element={<ArticuloInsumo />} />
          <Route path="unidad-medida/:idEmpresa/:idSucursal" element={<UnidadMedida />} />
        </Route >

        <Route element={<ProtectedRoute roles={['administrador', 'superadmin', 'cocinero', 'delivery', 'cajero']} />}>
          <Route path="pedidos/:idEmpresa/:idSucursal" element={<PedidosList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;