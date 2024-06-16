"use client";

import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import useAuth from "../components/useAuth";
import { CircularProgress, Grid } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";
import { Button, message, Tooltip, Upload } from "antd";
import {
  UnorderedListOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CreateTasks from "../components/CreateTasks";
import Swal from "sweetalert2";
import PdfViewer from "../components/PdfViewer";

export default function ListaSolicitudes() {
  const { isAuthenticated, roles, nombre, email } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingTableTask, setLoadingTableTask] = useState(true);

  const [listadoMovilidades, setListaMovilidades] = useState([]);

  const [itemMovilidad, setItemMovilidad] = useState(null);

  const [showModalTareas, setShowModalTareas] = useState(false);

  const [listadoTask, setListadoTask] = useState([]);

  const [tableInfo, setTableInfo] = useState([]);

  useEffect(() => {
    getListado();
  }, []);

  async function getListado() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/listaMovilidades`,
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

        setListaMovilidades(JSON.parse(data.listadoMovilidades));
        setLoading(false);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (itemMovilidad) {
      if (email !== itemMovilidad.idConvocatoria.idCoordinador.email) {
        cargarTask();
      } else {
        cargarTabla();
      }
    }
  }, [itemMovilidad]);

  async function cargarTask() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/listaTareas/${itemMovilidad.idConvocatoria.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setListadoTask(JSON.parse(data.tasks));
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function cargarTabla() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tablaTareas/${itemMovilidad.idConvocatoria.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        var array = Object.entries(JSON.parse(data.tasksTable)).map(
          ([key, value]) => ({ key, value })
        );

        setTableInfo(array);
        setLoadingTableTask(false);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const beforeUpload = (file) => {
    const isPng =
      file.type === "image/png" ||
      file.type === "application/pdf" ||
      file.type === "image/jpeg";
    if (!isPng) {
      message.error("Solo puedes subir archivos PDF,JPG y PNG!");
    }
    return isPng || Upload.LIST_IGNORE;
  };

  return (
    <Grid container>
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
          <Grid item xs={11}>
            {itemMovilidad ? (
              <h3>
                {itemMovilidad.idConvocatoria
                  ? itemMovilidad.idConvocatoria.titulo
                  : itemMovilidad.titulo}
              </h3>
            ) : (
              <h3>Mis Movilidades</h3>
            )}
          </Grid>
          {itemMovilidad ? (
            <Grid
              item
              xs={1}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Volver">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UnorderedListOutlined />}
                  onClick={() => {
                    setItemMovilidad(null);
                    setListadoTask([]);
                    setLoadingTableTask(true);
                  }}
                />
              </Tooltip>
            </Grid>
          ) : (
            <></>
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
            ) : showModalTareas ? (
              <CreateTasks
                idConvocatoria={itemMovilidad.idConvocatoria.id}
                showMovilidad={showModalTareas}
                setShowMovilidad={setShowModalTareas}
              />
            ) : itemMovilidad ? (
              email !== itemMovilidad.idConvocatoria.idCoordinador.email ? (
                <Grid container>
                  <Grid item xs={12}>
                    <Scrollbars
                      autoHeight
                      autoHeightMin={
                        email ==
                        itemMovilidad.idConvocatoria.idCoordinador.email
                          ? "59vh"
                          : "65vh"
                      }
                      autoHide
                    >
                      <Grid
                        container
                        style={
                          listadoTask.length > 0
                            ? {}
                            : {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "55vh",
                              }
                        }
                        rowGap={4}
                      >
                        {listadoTask.length > 0 ? (
                          listadoTask.map((item, index) =>
                            item.status == "SIN ENTREGAR" ? (
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
                                      backgroundColor: "#F1C40F",
                                      color: "white",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <Grid
                                      item
                                      md={9}
                                      xs={12}
                                      style={{ padding: "16px 20px" }}
                                    >
                                      <Grid container rowGap={2}>
                                        <Grid item xs={12}>
                                          <span>{item.idTarea.titulo}</span>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <span>
                                            {item.idTarea.descripcion}
                                          </span>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                      }}
                                      className="tareasUpload"
                                    >
                                      <Upload
                                        beforeUpload={beforeUpload}
                                        maxCount={1}
                                        onChange={(info) => {
                                          var formDataIMG = new FormData();
                                          formDataIMG.append(
                                            "file",
                                            info.fileList[0].originFileObj
                                          );

                                          Swal.fire({
                                            title:
                                              "¿Quieres subir esta imagen?",
                                            inputAttributes: {
                                              autocapitalize: "off",
                                            },
                                            showCancelButton: true,
                                            confirmButtonText:
                                              "Si,sube la imagen.",
                                            showLoaderOnConfirm: true,
                                            preConfirm: async () => {
                                              try {
                                                const response = await fetch(
                                                  `http://127.0.0.1:8000/api/taskImgUpload/${itemMovilidad.id}/${item.idTarea.id}`,
                                                  {
                                                    body: formDataIMG,
                                                    method: "POST",
                                                    headers: {
                                                      Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                      )}`,
                                                    },
                                                  }
                                                );

                                                if (response.ok) {
                                                  const data =
                                                    await response.json();
                                                } else {
                                                  console.log("error");
                                                }
                                              } catch (error) {
                                                console.error("Error:", error);
                                              }
                                            },
                                            allowOutsideClick: () =>
                                              !Swal.isLoading(),
                                          }).then((result) => {
                                            if (result.isConfirmed) {
                                              Swal.fire({
                                                title:
                                                  "Se ha subido correctamente la imagen.",
                                                icon: "success",
                                              });
                                              setListadoTask([]);
                                              cargarTask();
                                            }
                                          });
                                        }}
                                        style={{ width: "100%" }}
                                      >
                                        <Button
                                          style={{ width: "100%" }}
                                          icon={<UploadOutlined />}
                                        >
                                          Subir
                                        </Button>
                                      </Upload>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={1}></Grid>
                              </>
                            ) : item.status == "ANUNCIO" ? (
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
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ padding: "16px 20px" }}
                                    >
                                      <h4>{item.idTarea.titulo}</h4>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ padding: "16px 20px" }}
                                    >
                                      <span>{item.idTarea.descripcion}</span>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={1}></Grid>
                              </>
                            ) : (
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
                                      backgroundColor: "#229954",
                                      color: "white",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <Grid
                                      item
                                      md={9}
                                      xs={12}
                                      style={{ padding: "16px 20px" }}
                                    >
                                      <Grid container rowGap={2}>
                                        <Grid item xs={12}>
                                          <span>{item.idTarea.titulo}</span>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <span>
                                            {item.idTarea.descripcion}
                                          </span>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      md={2}
                                      xs={9}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <PdfViewer
                                        fileUrl={`http://127.0.0.1:8000/itemsTareas/${item.url}`}
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={1}
                                      md={0.5}
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Tooltip title="Eliminar Archivo">
                                        <Button
                                          type="primary"
                                          shape="circle"
                                          icon={<DeleteOutlined />}
                                          onClick={() => {
                                            var formDataImg = new FormData();
                                            formDataImg.append(
                                              "idTareaMovilidadd",
                                              item.id
                                            );

                                            Swal.fire({
                                              title:
                                                "¿Quieres eliminar esta imagen?",
                                              inputAttributes: {
                                                autocapitalize: "off",
                                              },
                                              showCancelButton: true,
                                              confirmButtonText:
                                                "Si,elimina la imagen.",
                                              showLoaderOnConfirm: true,
                                              preConfirm: async () => {
                                                try {
                                                  const response = await fetch(
                                                    `http://127.0.0.1:8000/api/deleteTaskImg`,
                                                    {
                                                      body: formDataImg,
                                                      method: "POST",
                                                      headers: {
                                                        Authorization: `Bearer ${localStorage.getItem(
                                                          "token"
                                                        )}`,
                                                      },
                                                    }
                                                  );

                                                  if (response.ok) {
                                                    const data =
                                                      await response.json();
                                                  } else {
                                                    console.log("error");
                                                  }
                                                } catch (error) {
                                                  console.error(
                                                    "Error:",
                                                    error
                                                  );
                                                }
                                              },
                                              allowOutsideClick: () =>
                                                !Swal.isLoading(),
                                            }).then((result) => {
                                              if (result.isConfirmed) {
                                                Swal.fire({
                                                  title:
                                                    "Se ha eliminado la imagen.",
                                                  icon: "success",
                                                });
                                                setListadoTask([]);
                                                cargarTask();
                                              }
                                            });
                                          }}
                                        />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </Grid>{" "}
                                <Grid item xs={1}></Grid>
                              </>
                            )
                          )
                        ) : (
                          <CircularProgress />
                        )}
                      </Grid>
                    </Scrollbars>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item xs={0.5}></Grid>
                  <Grid
                    item
                    xs={11}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Scrollbars autoHeight autoHeightMin={"65vh"}>
                      {loadingTableTask ? (
                        <Grid container style={{ height: "65vh" }}>
                          <Grid
                            item
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CircularProgress />
                          </Grid>
                        </Grid>
                      ) : (
                        <table className="tablaTareas">
                          <thead>
                            <tr>
                              {tableInfo.length > 0 ? (
                                Object.keys(tableInfo[0].value).map(
                                  (item, index) => (
                                    <th key={index}>{item.toUpperCase()}</th>
                                  )
                                )
                              ) : (
                                <></>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {tableInfo.length > 0 ? (
                              tableInfo.map((item, index) => (
                                <tr key={index}>
                                  {Object.keys(item.value).map(
                                    (nombrePropiedad, index) => (
                                      <td key={index}>
                                        {nombrePropiedad === "nombre" ? (
                                          item.value[nombrePropiedad]
                                        ) : item.value[nombrePropiedad] ? (
                                          <PdfViewer
                                            fileUrl={`http://127.0.0.1:8000/itemsTareas/${item.value[nombrePropiedad]}`}
                                          />
                                        ) : (
                                          <span style={{ color: "red" }}>
                                            Sin entregar
                                          </span>
                                        )}
                                      </td>
                                    )
                                  )}
                                </tr>
                              ))
                            ) : (
                              <></>
                            )}
                          </tbody>
                        </table>
                      )}
                    </Scrollbars>
                  </Grid>
                  <Grid item xs={0.5}></Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      height: "5vh",
                      textAlign: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <Grid container>
                      <Grid item xs={11}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Crear Tarea">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              setShowModalTareas(true);
                            }}
                          />
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
            ) : listadoMovilidades.length > 0 ? (
              <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                <Grid container rowGap={3}>
                  {listadoMovilidades.map((item, index) =>
                    item.idConvocatoria ? (
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
                            setItemMovilidad(item);
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
                            <Grid item md={6} style={{ padding: "16px 20px" }}>
                              <span>{item.idConvocatoria.titulo}</span>
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
                              {item.idConvocatoria.tipoMovilidad}
                            </Grid>
                            <Grid item xs={6} style={{ padding: "16px 20px" }}>
                              <span>Año escolar: {item.idUser.anoEscolar}</span>
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
                              <span>
                                {new Date(
                                  item.idConvocatoria.fechaListaFinal
                                ).toLocaleDateString() +
                                  " - " +
                                  new Date(
                                    item.idConvocatoria.fechaFin
                                  ).toLocaleDateString()}
                              </span>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </>
                    ) : (
                      <Grid
                        item
                        xs={10}
                        key={index}
                        style={{
                          marginRight: "20px",
                          marginLeft: "100px",
                          color: "white",
                        }}
                        onClick={() => {
                          setItemMovilidad(item);
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
                            <span>{item.titulo}</span>
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
                            {item.tipoMovilidad}
                          </Grid>
                          <Grid item xs={6} style={{ padding: "16px 20px" }}>
                            <span>Coordinador</span>
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
                            <span>
                              {new Date(
                                item.fechaListaFinal
                              ).toLocaleDateString() +
                                " - " +
                                new Date(item.fechaFin).toLocaleDateString()}
                            </span>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  )}
                </Grid>
              </Scrollbars>
            ) : (
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
                  <span>No tienes movilidades</span>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
