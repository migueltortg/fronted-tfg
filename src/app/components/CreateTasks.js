import React, { useEffect, useState } from "react";
import { Button, Modal, Switch } from "antd";
import { Grid } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";

const CreateTasks = ({ idConvocatoria, showMovilidad, setShowMovilidad }) => {
  const handleCloseModal = () => {
    setShowMovilidad(false);
  };

  const [crearTask, setCrearTask] = useState({
    archivo: false,
    titulo: "",
    descripcion: "",
  });

  const [rowError, setRowError] = React.useState(false);

  function changeCreateTask(name, value) {
    setCrearTask({
      ...crearTask,
      [name]: value,
    });
  }

  useEffect(() => {
    console.log(crearTask);
  }, [crearTask]);

  async function crearTaskFetch() {
    if (crearTask.titulo !== "" && crearTask.descripcion !== "") {
      var formData = new FormData();
      formData.append("task", JSON.stringify(crearTask));

      Swal.fire({
        title: "¿Quieres hacer una tarea?",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Si,crea tarea.",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await fetch(
              `http://127.0.0.1:8000/api/crearTask/${idConvocatoria}`,
              {
                body: formData,
                method:"POST",
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
            title: "Se ha creado la tarea correctamente.",
            icon: "success",
          });
          setShowMovilidad(false);
        }
      });
    } else {
      setRowError(true);
    }
  }

  return (
    <Modal
      title={"Crear Tarea"}
      visible={showMovilidad}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={"85%"}
    >
      {/* //MODAL PARA CREAR TAREA */}
      <Grid container>
        <Grid item xs={12}>
          <Scrollbars autoHeight autoHeightMin={"30vh"} autoHide>
            <Grid container rowGap={4} style={{ marginTop: "30px" }}>
              <Grid item xs={6}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={7}>
                    <span>Titulo de la Tarea</span>
                  </Grid>
                  <Grid item xs={11}>
                    <Form.Control
                      onChange={(e) =>
                        changeCreateTask("titulo", e.target.value)
                      }
                      value={crearTask.titulo}
                      style={
                        rowError
                          ? crearTask.titulo == ""
                            ? { border: "1px solid red" }
                            : {}
                          : {}
                      }
                    ></Form.Control>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={7}>
                    <span>Descripción de la Tarea</span>
                  </Grid>
                  <Grid item xs={11}>
                    <Form.Control
                      onChange={(e) =>
                        changeCreateTask("descripcion", e.target.value)
                      }
                      value={crearTask.descripcion}
                      style={
                        rowError
                          ? crearTask.descripcion == ""
                            ? { border: "1px solid red" }
                            : {}
                          : {}
                      }
                    ></Form.Control>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={7}>
                    <span>¿Tienen los alumnos que adjuntar algun archivo?</span>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    style={{ display: "flex", justifyContent: "right" }}
                  >
                    <Switch
                      value={crearTask.archivo ? true : false}
                      onClick={(e) => {
                        changeCreateTask("archivo", e);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Scrollbars>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            type="primary"
            className="loginButton"
            style={{
              width: "20%",
              backgroundColor: "#004494",
              border: "0px",
              boxShadow: "0px",
            }}
            onClick={() => crearTaskFetch()}
          >
            Crear Tarea
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default CreateTasks;
