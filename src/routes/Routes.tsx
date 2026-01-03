import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LogInPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import TodoPage from "../pages/TodoPage";
import SignUpPage from "../pages/SignUpPage";

function Router() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <TodoPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
            path="/signup"
            element={
                <PublicRoute>
                    <SignUpPage />
                </PublicRoute>
            }
            />
            <Route
                path="/todo"
                element={
                    <ProtectedRoute>
                        <TodoPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default Router