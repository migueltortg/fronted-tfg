"use client";

import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import useAuth from "../components/useAuth";
import { CircularProgress, Grid } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";
import { Button, Image, InputNumber, Tooltip } from "antd";
import { Form } from "react-bootstrap";
import PdfViewer from "../components/PdfViewer";
import Swal from "sweetalert2";
import { UnorderedListOutlined } from "@ant-design/icons";

export default function ListaSolicitudes() {
  const { isAuthenticated, roles, nombre } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingItem, setLoadingItem] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [itemSolicitud, setItemSolicitud] = useState(null);
  const [itemBaremableImg, setItemBaremableImg] = useState([]);
  const [notasBaremar, setNotasBaremar] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [solicitudesFiltered, setSolicitudesFiltered] = useState([]);

  useEffect(() => {
    console.log(notasBaremar);
  }, [notasBaremar]);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    if (itemSolicitud) {
      cargarItemsSolicitud();
    }
  }, [itemSolicitud]);

  const cargarSolicitudes = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/listaSolicitudes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data.solicitudes);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setLoadingItem(true);
    }
  };

  const cargarItemsSolicitud = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/listaImgSolicitud/${itemSolicitud.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setItemBaremableImg(data.imagenes);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingItem(false);
    }
  };

  async function tryBaremar() {
    var formData = new FormData();

    itemSolicitud.idConvocatoria.itemsBaremables.map((item) => {
      if (notasBaremar[item.id]) {
        formData.append(item.id, notasBaremar[item.id]);
      } else {
        formData.append(item.id, item.valorMin);
      }
    });

    Swal.fire({
      title: "¿Estas seguro de baremar la solicitud?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,barema la solicitud",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/baremarSolicitud/${itemSolicitud.id}`,
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
          title: "Se ha baremado con éxito la solicitud",
          icon: "success",
        });
        setItemSolicitud(null);
        setLoading(true);
        cargarSolicitudes();
      }
    });
  }

  useEffect(() => {
    if (filterText !== "") {
      const filteredSolicitudes = solicitudes.filter((item) =>
        (item.idUser.nombre + " " + item.idUser.apellido)
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
      setSolicitudesFiltered(filteredSolicitudes);
    } else {
      setSolicitudesFiltered(solicitudes);
    }
  }, [filterText, solicitudes]);

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
        <Grid container rowGap={1} style={{ width: "80vw" }}>
          {itemSolicitud ? (
            <>
              <Grid item xs={11}>
                <h3>Listado de Solicitudes</h3>
              </Grid>
              <Grid
                item
                xs={1}
                style={{ display: "flex", justifyContent: "right" }}
              >
                <Tooltip title="Volver">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<UnorderedListOutlined />}
                    onClick={() => {
                      setItemSolicitud(null);
                    }}
                  />
                </Tooltip>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={9} xs={12}>
                <h3>Listado de Solicitudes</h3>
              </Grid>
              <Grid item md={3} xs={12}>
                <Form.Control
                  onChange={(e) => setFilterText(e.target.value)}
                  value={filterText}
                  placeholder="Nombre Usuario"
                  style={{ width: "100%" }}
                ></Form.Control>
              </Grid>
            </>
          )}
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
            <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
              <Grid container rowGap={5}>
                {loading ? (
                  <Grid item xs={12}>
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
                  </Grid>
                ) : itemSolicitud ? (
                  <Grid item xs={12} style={{ paddingLeft: "20px" }}>
                    <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                      <Grid container columnGap={2} rowGap={2}>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Nombre</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idUser.nombre}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Apellidos</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idUser.apellido}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>DNI Alumno</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idUser.dni}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Grupo</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idGrupo.nombre}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Convocatoria</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idConvocatoria.titulo}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={11.5}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Paises</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                value={itemSolicitud.idConvocatoria.paises}
                                disabled={true}
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={11.7}
                          xs={11.5}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Scrollbars
                            autoHeight
                            autoHeightMin={"25vh"}
                            autoHide
                          >
                            {loadingItem ? (
                              <CircularProgress />
                            ) : (
                              <table className="custom-table">
                                <thead>
                                  <tr>
                                    <th>Item Baremable</th>
                                    <th>Valor Minimo</th>
                                    <th>Valor Máximo</th>
                                    <th>Archivos</th>
                                    <th>Nota</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itemSolicitud.idConvocatoria.itemsBaremables
                                    .length > 0 ? (
                                    itemSolicitud.idConvocatoria.itemsBaremables.map(
                                      (item, index) => (
                                        <tr key={index} className="table-row">
                                          <td className="item-name">
                                            {item.nombre}
                                          </td>
                                          <td>{item.valorMin}</td>
                                          <td>{item.valorMax}</td>
                                          <td className="file-column">
                                            {item.presentaUser &&
                                              itemBaremableImg[item.id] && (
                                                <PdfViewer
                                                  fileUrl={`http://127.0.0.1:8000/itemsBaremables/${
                                                    itemBaremableImg[item.id]
                                                  }`}
                                                />
                                              )}
                                          </td>
                                          <td className="note-column">
                                            <InputNumber
                                              min={item.valorMin}
                                              max={item.valorMax}
                                              defaultValue={item.valorMin}
                                              onChange={(e) =>
                                                setNotasBaremar({
                                                  ...notasBaremar,
                                                  [item.id]: e,
                                                })
                                              }
                                            />
                                          </td>
                                        </tr>
                                      )
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </tbody>
                              </table>
                            )}
                          </Scrollbars>
                        </Grid>
                        <Grid item xs={11.7} style={{ marginTop: "15px" }}>
                          <Button
                            type="primary"
                            className="loginButton"
                            style={{
                              width: "100%",
                              backgroundColor: "#004494",
                              border: "0px",
                              boxShadow: "0px",
                            }}
                            onClick={() => tryBaremar()}
                          >
                            Baremar
                          </Button>
                        </Grid>
                      </Grid>
                    </Scrollbars>
                  </Grid>
                ) : solicitudesFiltered.length ? (
                  solicitudesFiltered.map((item, index) => (
                    <>
                      <Grid item xs={1}></Grid>
                      <Grid
                        item
                        xs={10}
                        key={index}
                        style={{
                          color: "white",
                        }}
                        onClick={() => {
                          setItemSolicitud(item);
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
                          <Grid item xs={6} style={{ padding: "16px 20px" }}>
                            <span>
                              {item.idUser.nombre + " " + item.idUser.apellido}
                            </span>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              padding: "16px 20px",
                            }}
                          >
                            <span>{item.idGrupo.clave}</span>
                          </Grid>
                          <Grid item xs={6} style={{ padding: "16px 20px" }}>
                            <span>{item.idConvocatoria.titulo}</span>
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              padding: "16px 20px",
                            }}
                          >
                            <span>
                              Fecha Fin de Inscripción:{" "}
                              {new Date(
                                item.idConvocatoria.fechaInscripcionFin
                              ).toLocaleDateString()}
                            </span>
                          </Grid>
                        </Grid>
                      </Grid>{" "}
                      <Grid item xs={1}></Grid>
                    </>
                  ))
                ) : (
                  <p>No existen solicitudes a ese nombre.</p>
                )}
              </Grid>
            </Scrollbars>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
