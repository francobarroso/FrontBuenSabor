import { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface ProtectedComponentProps {
  roles: string[];
  children: ReactNode;
}

const ProtectedComponent = ({ roles, children }: ProtectedComponentProps) => {
    const { user } = useAuth0();

    const userHasRequiredRole = user && roles.some(role => JSON.stringify(user).includes(role));

    return userHasRequiredRole ? <>{children}</> : null;
};

export default ProtectedComponent;
