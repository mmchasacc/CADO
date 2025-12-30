import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../context/Auth";

function PublicRoute({ children }: { children: React.ReactNode }) {
    if (isAuthenticated()) {
        return <Navigate to="/todo" replace />
    }

    return children
}

export default PublicRoute