import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./screens/Loading";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;