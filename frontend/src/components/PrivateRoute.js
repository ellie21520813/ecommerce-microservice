import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.authen.token);
  const user = useSelector(state => state.authen.user);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
