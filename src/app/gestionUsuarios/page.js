"use client";

import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import useAuth from "../components/useAuth";
import { CircularProgress, Grid } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";
import { Button, message, Select, Tooltip, Upload } from "antd";
import {
  UnorderedListOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CreateTasks from "../components/CreateTasks";
import Swal from "sweetalert2";
import PdfViewer from "../components/PdfViewer";
import { Form } from "react-bootstrap";

export default function ListaSolicitudes() {
  const { isAuthenticated, roles, nombre, email } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listUsers, setListUsers] = useState([]);
  const [newRoles, setNewRoles] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [filterRole, setFilterRole] = useState([]);

  const [filterUsers, setFilterUsers] = useState([]);

  useEffect(() => {
    console.log(newRoles);
  }, [newRoles]);

  useEffect(() => {
    if (loading) {
      cargarUsers();
    }
  }, []);

  //GUARDAR CAMBIOS DE ROLES DE USUARIOS
  async function trySaveRoles(indexUser) {
    var formData = new FormData();

    formData.append("roles", listUsers[indexUser].roles);

    Swal.fire({
      title: "¿Estas seguro de querer editar el usuario?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,edita el usuario",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/editUser/${listUsers[indexUser].id}`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
          } else {
            console.log("error");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Se ha editado con exito",
          icon: "success",
        });
      }
    });
  }

  //CONFIRMACION ELIMINAR USUARIO
  async function tryDelete(indexUser) {
    Swal.fire({
      title: "¿Estas seguro de querer eliminar el usuario?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,elimina el usuario",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/deleteUser/${listUsers[indexUser].id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
          } else {
            console.log("error");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Se ha eliminado con exito",
          icon: "success",
        });
      }
    });
  }

  //CARGAR LOS USUARIOS
  async function cargarUsers() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/listUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setListUsers(data.users);
        setLoading(false);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {//FUNCION FILTRAR
    if (filterText !== "" || filterRole.length > 0) {
      let filteredUser = listUsers;

      if (filterText !== "") {
        filteredUser = filteredUser.filter((item) =>
          (item.nombre + " " + item.apellido)
            .toLowerCase()
            .includes(filterText.toLowerCase())
        );
      }

      if (filterRole.length > 0) {
        filteredUser = filteredUser.filter((item) =>
          filterRole.every((rol) => item.roles.includes(rol))
        );
      }

      setFilterUsers(filteredUser);
    } else {
      setFilterUsers(listUsers);
    }
  }, [filterText, filterRole, listUsers]);

  return (
    <Grid container rowGap={1}>
      <Nav isAuthenticated={isAuthenticated} roles={roles} nombre={nombre} />
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "4vh",
        }}
      >
        <Grid container style={{ width: "80vw" }}>
          <Grid item xs={12}>
            <h3>Gestión de Usuarios</h3>
          </Grid>
          <Grid item xs={12}>{/* FILTROS */}
            <Grid container>
              <Grid item md={3} xs={5.9}>
                <Form.Control
                  onChange={(e) => setFilterText(e.target.value)}
                  value={filterText}
                  placeholder="Nombre Usuario"
                  style={{ width: "100%", height: "100%" }}
                ></Form.Control>
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={6}>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Filtro Roles"
                  options={[
                    { label: "ROLE_ADMIN", value: "ROLE_ADMIN" },
                    { label: "ROLE_USER", value: "ROLE_USER" },
                    {
                      label: "ROLE_PROFESOR",
                      value: "ROLE_PROFESOR",
                    },
                    {
                      label: "ROLE_COORDINADOR",
                      value: "ROLE_COORDINADOR",
                    },
                  ]}
                  style={{ width: "100%", height: "100%" }}
                  onChange={(e) => {
                    setFilterRole(e);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          rowGap={1}
          style={{
            backgroundColor: "#EAEAEA",
            borderRadius: "8px",
            paddingTop: "30px",
            width: "80vw",
          }}
        >
          <Grid item xs={12}>
            {loading ? (
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "65vh",
                  }}
                >
                  <CircularProgress />
                </Grid>
              </Grid>
            ) : filterUsers.length > 0 ? ( //VISTA DEL LISTADO DE USUARIOS FILTRADOS
              <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                <Grid container rowGap={4}>
                  {filterUsers.map((item, index) => (
                    <>
                      <Grid item xs={1}></Grid>
                      <Grid
                        item
                        xs={10}
                        key={index}
                        style={{
                          color: "white",
                        }}
                      >
                        <Grid
                          container
                          style={{
                            backgroundColor: "#004494",
                            color: "white",
                            borderRadius: "8px",
                          }}
                        >
                          <Grid item md={4} xs={12}>
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                style={{ padding: "8px 10px" }}
                              >
                                <span>
                                  {item.apellido
                                    ? item.nombre + " " + item.apellido
                                    : item.nombre}
                                </span>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                style={{ padding: "8px 10px" }}
                              >
                                <span>{item.email}</span>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item md={8} xs={12}>
                            <Grid container style={{ height: "100%" }}>
                              <Grid
                                item
                                md={8}
                                xs={12}
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "8px 10px",
                                }}
                              >
                                <Select
                                  mode="multiple"
                                  allowClear
                                  placeholder="Selecciona los roles"
                                  options={[
                                    {
                                      label: "ROLE_ADMIN",
                                      value: "ROLE_ADMIN",
                                    },
                                    { label: "ROLE_USER", value: "ROLE_USER" },
                                    {
                                      label: "ROLE_PROFESOR",
                                      value: "ROLE_PROFESOR",
                                    },
                                    {
                                      label: "ROLE_COORDINADOR",
                                      value: "ROLE_COORDINADOR",
                                    },
                                  ]}
                                  style={{ width: "100%" }}
                                  onChange={(e) => {
                                    var prueba = [...listUsers];
                                    prueba[index].roles = e;
                                    setListUsers(prueba);
                                  }}
                                  value={item.roles}
                                />
                              </Grid>

                              <Grid
                                item
                                md={2}
                                xs={6}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "8px 10px",
                                }}
                              >
                                <Button
                                  type="primary"
                                  className="loginButton"
                                  style={{
                                    backgroundColor: "white",
                                    color: "#004494",
                                    fontWeight: "bold",
                                    border: "0px",
                                    boxShadow: "0px",
                                  }}
                                  onClick={() => trySaveRoles(index)}
                                >
                                  Guardar
                                </Button>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                xs={6}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "8px 10px",
                                }}
                              >
                                <Button
                                  type="primary"
                                  className="loginButton"
                                  style={{
                                    backgroundColor: "white",
                                    color: "#004494",
                                    fontWeight: "bold",
                                    border: "0px",
                                    boxShadow: "0px",
                                  }}
                                  onClick={() => tryDelete(index)}
                                >
                                  Eliminar
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}></Grid>
                    </>
                  ))}
                </Grid>
              </Scrollbars>
            ) : ( // SI NO EXISTE USUARIOS QUE CORRESPONDAN CON LOS FILTROS
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "65vh",
                  }}
                >
                  <span>No hay usuarios con esos filtros.</span>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
