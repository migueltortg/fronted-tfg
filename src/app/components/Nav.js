"use client";

import { Grid, Box } from "@mui/material";
import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

export default function Nav({ isAuthenticated, roles, nombre }) {
  const router = useRouter();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const buttonStyle = {
    fontSize: "14px",
    backgroundColor: "white",
    color: "#004494",
    fontWeight: "bold",
    width: "100%",
  };

  const gridItemStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "8px",
  };

  const renderButtonsForRoles = () => {//SE CARGAN ARRAY CON BOTONES PERMITIDOS SEGUN TU ROL
    const buttons = [];

    if (roles.includes("ROLE_USER")) {
      buttons.push(
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={gridItemStyle}
          key="misMovilidades"
        >
          <Button variant="primary" href="/misMovilidades" style={buttonStyle}>
            Mis Movilidades
          </Button>
        </Grid>
      );
    }

    if (roles.includes("ROLE_USER")) {
      buttons.push(
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={gridItemStyle}
          key="listaConvocatorias"
        >
          <Button
            variant="primary"
            href="/listaConvocatorias"
            style={buttonStyle}
          >
            Listado Convocatorias
          </Button>
        </Grid>
      );
    }

    if (roles.includes("ROLE_COORDINADOR")) {
      buttons.push(
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={gridItemStyle}
          key="listaSolicitudes"
        >
          <Button
            variant="primary"
            href="/listaSolicitudes"
            style={buttonStyle}
          >
            Listado Solicitudes
          </Button>
        </Grid>
      );
    }

    if (roles.includes("ROLE_ADMIN")) {
      buttons.push(
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={gridItemStyle}
          key="gestionUsuarios"
        >
          <Button variant="primary" href="/gestionUsuarios" style={buttonStyle}>
            Gestión Usuarios
          </Button>
        </Grid>
      );
    }

    return buttons;
  };

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid
          item
          xs={12}
          style={{
            backgroundColor: "#004494",
            overflow: "hidden",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          {isAuthenticated ? (
            <Grid
              container
              style={{
                padding: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Grid item xs={12} md={7}>
                <Grid container>{renderButtonsForRoles()}</Grid>
              </Grid>

              <Grid
                item
                xs={12}
                md={3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  
                }}
              >
                <Grid container>
                  <Grid
                    item
                    md={8}
                    xs={6}
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "white", marginRight: "16px" }}>
                      {nombre}
                    </span>
                  </Grid>
                  <Grid item md={4}>
                    <Button
                      variant="primary"
                      onClick={cerrarSesion}
                      style={buttonStyle}
                    >
                      Cerrar Sesión
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px",
              }}
            >
              <Grid item xs={12} sm={6} style={gridItemStyle}>
                <Button variant="primary" href="/login" style={buttonStyle}>
                  Iniciar Sesión
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} style={gridItemStyle}>
                <Button variant="primary" href="/register" style={buttonStyle}>
                  Registrarse
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
