"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "./useAuth";

const Providers = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const decodedToken = atob(token);

    const [userId, email, userName, rolesString] = decodedToken.split("|");

    var rolesArray;
    if(rolesString!=="" && rolesString!==undefined){
      rolesArray = rolesString.split(",");
    }else{
      rolesArray =[];
    }

    if (!token && pathname !== "/" && pathname !== "/registro") {//SI NO ESTA LOGUEADO TE LLEVA AL LOGIN
      router.push("/login");
    }else{
      if (pathname === "/gestionUsuarios" && !rolesArray.includes("ROLE_ADMIN")) {//SE CONTROLA QUE SEAS ADMINS PARA ENTRAR EN GESTION USUARIOS
        router.push("/");
      }
  
      if (
        pathname === "/listaSolicitudes" &&
        !rolesArray.includes("ROLE_COORDINADOR")
      ) {//SE CONTROLA QUE SEAS COORDINADOR PARA ENTRAR EN EL LISTADO DE SOLICITUDES
        router.push("/");
      }
    }

    
    
  }, [router]);

  return <>{children}</>;//SE CARGA EL OBJETO
};

export default Providers;
