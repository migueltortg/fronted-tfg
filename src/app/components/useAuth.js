import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const updateAuthState = () => {
    const token = localStorage.getItem("token");//SE COGE EL TOKE,QUE TIENE LA INFORMACION ENCRIPTADA
    if (token) {
      setIsAuthenticated(true);

      const decodedToken = atob(token);//SE DESINCRIPTA
      const [userId, email, userName, rolesString] = decodedToken.split("|");//SE OBTIENE LA INFORMACIÓN
      const rolesArray = rolesString.split(",");

      setRoles(rolesArray);
      setNombre(userName);
      setEmail(email);
    } else {
      setIsAuthenticated(false);
      setRoles([]);
      setNombre("");
    }
  };

  useEffect(() => {
    
    setLoading(false);
    updateAuthState();

    const handleStorageChange = () => {
      updateAuthState();
    };
    setLoading(true);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    roles,
    nombre,
    email,
  };
};

export default useAuth;
