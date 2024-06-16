import React, { useState } from "react";
import { Button, Modal, Table } from "antd";
import ReactDragListView from "react-drag-listview";
import { Grid } from "@mui/material";
import { Scrollbar } from "react-scrollbars-custom";
import Scrollbars from "react-custom-scrollbars-2";
import Swal from "sweetalert2";

const FinalList = ({ idConvocatoria, showFinalList, setShowFinalList }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCloseModal = () => {
    setShowFinalList(false);
  };

  const dragProps = {//MANEJAMOS EL DRAG
    onDragEnd(fromIndex, toIndex) {
      if (toIndex < 0) return; 
      const newData = [...dataSource];
      const item = newData.splice(fromIndex, 1)[0];
      newData.splice(toIndex, 0, item);
      setDataSource(newData);
    },
    handleSelector: ".drag-handle",
    ignoreSelector: "react-resizable-handle",
  };

  React.useEffect(() => {//CONSEGUIMOS LA INFORMACION DE LA LISTA PROVISIONAL
    getListadoInfo();
  }, []);

  async function getListadoInfo() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/listadoProvisionalLista/${idConvocatoria}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setDataSource(data.solicitantes);
        setLoading(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const columns = [//DEFINIMOS LAS COLUMNAS
    {
      title: "N°",
      dataIndex: "number",
      key: "number",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
    },
    {
      title: "nota",
      dataIndex: "nota",
      key: "nota",
    },
    {
      title: "Cambiar Orden",
      key: "cambiarOrden",
      className: "drag-visible",
      render: () => (
        <span className="drag-handle" style={{ cursor: "move" }}>
          ⋮⋮
        </span>
      ),
    },
  ];

  return (
    <Modal
      title={"Lista Final de la convocatoria " + idConvocatoria}
      visible={showFinalList}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={"85%"}
    >
      <Grid container rowGap={3} style={{ marginTop: "30px" }}>
        <Grid item xs={12}>
          <Scrollbars autoHeight autoHeightMin={"30vh"} autoHide>
            {loading ? (
              <span style={{ display: "flex", justifyContent: "center" }}>
                Cargando...
              </span>
            ) : (
              <ReactDragListView {...dragProps}>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey="key"
                />
              </ReactDragListView>
            )}
          </Scrollbars>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              Swal.fire({
                title: "¿Quieres crear el listado definitivo?",
                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Si,crea el listado definitivo.",
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                  var formData = new FormData();
                  formData.append("listadoDefinitivo", JSON.stringify(dataSource));

                  try {
                    const response = await fetch(
                      `http://127.0.0.1:8000/api/listadoDefinitivo/${idConvocatoria}`,
                      {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                        body: formData,
                      }
                    );

                    if (response.ok) {
                      const data = await response.json();
                      setShowFinalList(false);
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
                    title: "Se ha creado con exito la lista final",
                    icon: "success",
                  });
                }
              });
            }}
          >
            Hacer Lista Final
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default FinalList;
