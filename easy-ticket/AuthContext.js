// DEPRECATED: Uso migrado para Redux. Não utilizar <AuthProvider>.
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser } from "./redux/authSlice";

// Mantido apenas para compatibilidade de chamadas existentes.
export const useAuth = () => {
  const user = useSelector(s => s.auth.user);
  const isLoading = useSelector(s => s.auth.isLoading);
  const dispatch = useDispatch();
  return {
    user,
    isLoading,
    login: (u) => dispatch(loginUser(u)),
    logout: () => dispatch(logoutUser()),
  };
};
