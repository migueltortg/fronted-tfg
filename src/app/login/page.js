"use client";

import { Grid } from "@mui/material";
import { Input, Button } from "antd";
import React from "react";
import useAuth from "../components/useAuth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loadingLogin, setLoadingLogin] = React.useState(false);

  //const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useAuth();

  const router = useRouter();

  function changeUser(e) {
    setUser(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  const loginTry = async () => {
    setLoadingLogin(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user, password: password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token',data.token);

        setIsAuthenticated(true);

        router.push("/");

      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error)
      console.error("Error:", error);
    }
  };

  return (
    <Grid container className="loginPage">
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          className="parent_container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item className="login_container" xs={10} md={5}>
            <Grid container rowGap={3}>
              <Grid item xs={12} className="login_tit">
                <h3>
                  Erasmus + <br></br>I.E.S Las Fuentezuelas
                </h3>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginRight: "10%",
                      marginLeft: "10%",
                    }}
                  >
                    <Grid container rowGap={5}>
                      <Grid item xs={12}>
                        <Grid container rowGap={0.5}>
                          <Grid item xs={12}>
                            <span style={{ color: "#004494" }}>Usuario</span>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Input
                              style={{ border: "4px solid #004494" }}
                              onChange={(e) => changeUser(e)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container rowGap={0.5}>
                          <Grid item xs={12}>
                            <span style={{ color: "#004494" }}>Contraseña</span>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Input.Password
                              onChange={(e) => changePassword(e)}
                              style={{ border: "4px solid #004494" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{marginTop:"5vh"}}>
                <Grid container rowGap={1} >
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "10%",
                      marginRight: "10%",
                      height: "6vh",
                      backgroundColor: "#004494",
                      borderRadius: "8px",
                    }}
                  >
                    <Button
                      type="primary"
                      className="loginButton"
                      style={{
                        width: "100%",
                        backgroundColor: "#004494",
                        border: "0px",
                        boxShadow: "0px",
                      }}
                      onClick={loginTry}
                    >
                      {!loadingLogin?"Iniciar Sesión":"Cargando..."}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <a href="/registro">Registro</a>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
