import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout, syncSessionState } from "../features/auth/authSlice";
import { isAdminSessionExpired } from "../utils/adminSession";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(syncSessionState());

    if (isAdminSessionExpired()) {
      dispatch(logout());
    }
  }, [dispatch]);

  if (!isAuthenticated || isAdminSessionExpired()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
