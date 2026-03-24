import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export function RequireAuth() {
  const ok = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();
  if (!ok) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
