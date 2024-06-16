"use client";

import { CircularProgress, Grid } from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useAuth from "../components/useAuth";
import Nav from "../components/Nav";
import React from "react";
import {
  PlusOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  InputNumber,
  message,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Upload,
} from "antd";
import { Form } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import moment from "moment";
import FinalList from "../components/FinalList";

export default function listaConvocatorias() {
  const [loading, setLoading] = React.useState(true);

  const { isAuthenticated, setIsAuthenticated, roles, nombre } = useAuth();

  const [convocatorias, setConvocatorias] = React.useState([]);

  const [crearConvocatoriaDisplay, setCrearConvocatoriaDisplay] =
    React.useState(false);
  const [editarConvocatoria, setEditarConvocatoria] = React.useState(false);
  const [solicitudConvocatoriaDisplay, setSolicitudConvocatoriaDisplay] =
    React.useState(false);

  const [crearConvocatoria, setCrearConvocatoria] = React.useState([]);
  const [editarConvocatoriaChanges, setEditarConvocatoriaChanges] =
    React.useState({});

  const [crearConvocatoriaPage, setCrearConvocatoriaPage] = React.useState(1);

  const [error, setError] = React.useState(false);
  const [rowError, setRowError] = React.useState(false);
  const [errorItems, setErrorItems] = React.useState(false);

  const [solicitudItem, setSolicitudItem] = React.useState({});

  const [grupos, setGrupos] = React.useState({});

  const [itemsBaremables, setItemsBaremables] = React.useState([]);
  const [editRows, setEditRows] = React.useState([]);
  const [itemsBaremablesEdit, setItemsBaremablesEdit] = React.useState([]);
  const [itemsBaremablesFile, setItemsBaremablesFile] = React.useState([]);

  const [showFinalList, setShowFinalList] = React.useState(false);
  const [finalListId, setFinalListId] = React.useState(null);

  const [crearItemBaremable, setCrearItemBaremable] = React.useState({
    nombre: "",
    obligatorio: "NO",
    presenta_user: "NO",
    valor_min: 0,
    valor_max: 0,
  });

  const [filterText, setFilterText] = React.useState("");
  const [filterPais, setFilterPais] = React.useState([]);
  const [filterTipo, setFilterTipo] = React.useState("");

  const [convocatoriasFiltered, setConvocatoriasFiltered] = React.useState([]);

  const [loadingCrear, setLoadingCrear] = React.useState(true);
  const [coordinadoresOption, setCoordinadoresOption] = React.useState([]);

  const dateFormat = "DD/MM/YYYY";
  function changeConvocatoria(name, value) {
    setCrearConvocatoria({
      ...crearConvocatoria,
      [name]: value,
    });
  }

  function addItemBaremable(name, file) {
    setItemsBaremablesFile({
      ...itemsBaremablesFile,
      [name]: file,
    });
  }

  React.useEffect(() => {
    console.log(itemsBaremablesFile);
  }, [itemsBaremablesFile]);

  function changeEditConvocatoria(name, value) {
    setEditarConvocatoriaChanges({
      ...editarConvocatoriaChanges,
      [name]: value,
    });
  }

  function changeItemBaremable(name, value) {
    console.log(value);
    setCrearItemBaremable({
      ...crearItemBaremable,
      [name]: value,
    });
  }

  React.useEffect(() => {
    console.log(editarConvocatoriaChanges);
  }, [editarConvocatoriaChanges]);

  React.useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/listaConvocatorias",
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
        setGrupos(
          Object.fromEntries(
            data.grupos.map((item) => [item.clave, item.nombre])
          )
        );

        setConvocatorias(data.convocatorias);
        setLoading(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function changeCrearConvocatoriaDisplay() {
    if (solicitudConvocatoriaDisplay) {
      setSolicitudConvocatoriaDisplay(!solicitudConvocatoriaDisplay);
    } else if (editarConvocatoria) {
      setEditarConvocatoria(false);
    } else {
      setCrearConvocatoriaDisplay(!crearConvocatoriaDisplay);
      if (!crearConvocatoriaDisplay == true) {
        cargarCoordinadores();
      }
    }
  }

  async function cargarCoordinadores() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/cargarCoordinadores",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setCoordinadoresOption(data);
        setLoadingCrear(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function tryCrearConvocatoria() {
    if (validate()) {
      if (itemsBaremables.length > 0) {
        insertConvocatoria();
      } else {
        setErrorItems(true);
      }
    } else {
      setCrearConvocatoriaPage(1);
    }
  }

  async function tryEditConvocatoria() {
    var formData = new FormData();

    formData.append("id", editarConvocatoriaChanges.id);
    formData.append("titulo", editarConvocatoriaChanges.titulo);
    formData.append("tipoMovilidad", editarConvocatoriaChanges.tipoMovilidad);
    formData.append("numMovilidades", editarConvocatoriaChanges.numMovilidades);
    formData.append("paises", editarConvocatoriaChanges.paises);
    formData.append(
      "fechaInicio",
      dayjs(editarConvocatoriaChanges.fechaInicio).format("YYYY-MM-DD")
    );
    formData.append(
      "fechaFin",
      dayjs(editarConvocatoriaChanges.fechaFin).format("YYYY-MM-DD")
    );
    formData.append(
      "fechaInscripcionInicio",
      dayjs(editarConvocatoriaChanges.fechaInscripcionInicio).format(
        "YYYY-MM-DD"
      )
    );
    formData.append(
      "fechaInscripcionFin",
      dayjs(editarConvocatoriaChanges.fechaInscripcionFin).format("YYYY-MM-DD")
    );
    formData.append(
      "fechaListaProvisional",
      dayjs(editarConvocatoriaChanges.fechaListaProvisional).format(
        "YYYY-MM-DD"
      )
    );
    formData.append(
      "fechaApelacionesInicio",
      dayjs(editarConvocatoriaChanges.fechaApelacionesInicio).format(
        "YYYY-MM-DD"
      )
    );
    formData.append(
      "fechaApelacionesFin",
      dayjs(editarConvocatoriaChanges.fechaApelacionesFin).format("YYYY-MM-DD")
    );
    formData.append(
      "fechaListaFinal",
      dayjs(editarConvocatoriaChanges.fechaListaFinal).format("YYYY-MM-DD")
    );

    Swal.fire({
      title: "¿Estas seguro de querer editar la convocatoria?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,edita la convocatoria",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/editConvocatoria`,
            {
              method: "POST",
              body: formData,
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

        cargarConvocatorias();
      }
    });
  }

  async function tryListaProvisional(idConvocatoria) {
    Swal.fire({
      title: "¿Quieres hacer el listado provisional?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,crea el listado provisional",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/listadoProvisional/${idConvocatoria}`,
            {
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
          title: "Se ha creado la lista provisonal de esta Convocatoria",
          icon: "success",
        });
      }
    });
  }

  async function insertConvocatoria() {
    var formData = new FormData();

    formData.append("titulo", crearConvocatoria.titulo);
    formData.append("tipoMovilidad", crearConvocatoria.tipoMovilidad);
    formData.append("numMovilidades", crearConvocatoria.numMovilidades);
    formData.append("paises", crearConvocatoria.paises);
    formData.append("fechaInicio", crearConvocatoria.fechaInicio);
    formData.append("fechaFin", crearConvocatoria.fechaFin);
    formData.append(
      "fechaInscripcionInicio",
      crearConvocatoria.fechaInscripcionInicio
    );
    formData.append(
      "fechaInscripcionFin",
      crearConvocatoria.fechaInscripcionFin
    );
    formData.append(
      "fechaListaProvisional",
      crearConvocatoria.fechaListaProvisional
    );
    formData.append(
      "fechaApelacionesInicio",
      crearConvocatoria.fechaInscripcionInicio
    );
    formData.append(
      "fechaApelacionesFin",
      crearConvocatoria.fechaInscripcionFin
    );
    formData.append("idCoordinador", crearConvocatoria.idCoordinador);
    formData.append("fechaListaFinal", crearConvocatoria.fechaListaFinal);
    formData.append("itemsBaremables", JSON.stringify(itemsBaremables));

    Swal.fire({
      title: "¿Quieres crear una nueva convocatoria?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,crea la convocatoria",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/crearConvocatoria",
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();

            if (data == "created") {
              toast.success("Convocatoria Creada!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
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
          title: "Se ha creado con exito",
          icon: "success",
        });
        setLoading(true);
        cargarConvocatorias();
        setCrearConvocatoriaDisplay(false);
      }
    });
  }

  function validate() {
    var status = false;
    if (
      !crearConvocatoria.titulo ||
      crearConvocatoria.titulo == "" ||
      !crearConvocatoria.tipoMovilidad ||
      crearConvocatoria.tipoMovilidad == "" ||
      !crearConvocatoria.numMovilidades ||
      !crearConvocatoria.numMovilidades > 0 ||
      !crearConvocatoria.paises ||
      crearConvocatoria.paises == "" ||
      !crearConvocatoria.fechaInicio ||
      !crearConvocatoria.fechaFin ||
      !crearConvocatoria.fechaInscripcionInicio ||
      !crearConvocatoria.fechaInscripcionFin ||
      !crearConvocatoria.fechaListaProvisional ||
      !crearConvocatoria.fechaListaFinal ||
      !crearConvocatoria.idCoordinador
    ) {
      status = true;
    }

    setError(status);

    return !status;
  }

  async function deleteConvocatoria(id) {
    Swal.fire({
      title: "¿Estas seguro de querer eliminar la convocatoria?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,elimina la convocatoria",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/deleteConvocatoria/${id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            const data = await response.json();

            if (data == "deleted") {
              toast.success("Convocatoria Borrada", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              setLoading(true);
              cargarConvocatorias();
            }
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

        cargarConvocatorias();
      }
    });
  }

  function editarConvocatoriaFunction(id) {
    Swal.fire({
      title: "¿Quieres editar esta convocatoria?",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Si,edita la convocatoria",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const resp = `http://127.0.0.1:8000/api/getConvocatoria/${id}`;
          const response = await fetch(resp);
          const data = await response.json();

          console.log(data);

          setEditarConvocatoriaChanges(data);
          setEditarConvocatoria(!editarConvocatoria);
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Listo para editar`,
        });
      }
    });
  }

  async function tryRequest() {
    var status = true;

    solicitudItem.itemsBaremables.map((item) => {
      if (item.obligatorio && item.presentaUser) {
        if (itemsBaremablesFile[item.id]) {
          if (itemsBaremablesFile[item.id] == undefined) {
            status = false;
          }
        } else {
          status = false;
        }
      }
    });

    if (status) {
      var formData = new FormData();

      formData.append("idConvocatoria", solicitudItem.id);
      formData.append("token", localStorage.getItem("token"));

      Object.keys(itemsBaremablesFile)
        .map((key) => ({ id: key, file: itemsBaremablesFile[key] }))
        .map((item) => {
          formData.append("file_" + item.id, item.file);
        });

      Swal.fire({
        title: "Tramitar Solicitud",
        input: "select",
        inputOptions: grupos,
        showCancelButton: true,
        confirmButtonText: "Hacer Solicitud",
        showLoaderOnConfirm: true,
        inputPlaceholder: "Selecciona su grupo",
        preConfirm: async (grupo) => {
          try {
            const response = await fetch(
              `http://127.0.0.1:8000/api/hacerSolicitud/${grupo}`,
              {
                method: "POST",
                body: formData,
              }
            );

            if (response.ok) {
              const data = await response.json();
              Swal.fire({
                title: "Solicitud realizada con exito",
                icon: "success",
              });
            } else {
              const errorMessage = await response.text();
              Swal.fire({
                title: "Error al procesar la solicitud,asegurese de que ha elegido un grupo.",
                icon: "error",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error al procesar la solicitud,asegurese de que ha elegido un grupo.",
              icon: "error",
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    } else {
      Swal.fire({
        title: "Tienes que aportar todos los documentos obligatorios.",
        icon: "error",
      });
    }
  }

  const itemsBaremablesCols = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Obligatorio",
      dataIndex: "obligatorio",
      key: "obligatorio",
    },
    {
      title: "Presenta Usuario",
      dataIndex: "presenta_user",
      key: "presenta_user",
    },
    {
      title: "Valor Mínimo",
      dataIndex: "valor_min",
      key: "valor_min",
    },
    {
      title: "Valor Máximo",
      dataIndex: "valor_max",
      key: "valor_max",
    },
    {
      title: "Acciones",
      dataIndex: "Acciones",
      key: "Acciones",
    },
  ];

  function addRow() { //AÑADIR FILA CON VALIDACION
    if (validateRows()) {
      const newItemsBaremables = [...itemsBaremables, crearItemBaremable];
      setItemsBaremables(newItemsBaremables);
      setItemsBaremablesEdit(newItemsBaremables);
      setCrearItemBaremable({
        nombre: "",
        obligatorio: "NO",
        presenta_user: "NO",
        valor_min: 0,
        valor_max: 0,
      });
    }
  }

  function validateRows() {//SE VALIDA LOS INPUTS DE CREAR CONVOCATORIA
    var validate = true;

    if (crearItemBaremable.nombre == "") {
      validate = false;
    }

    if (
      crearItemBaremable.valor_max < crearItemBaremable.valor_min ||
      crearItemBaremable.valor_min < 0
    ) {
      validate = false;
    }

    setRowError(!validate);
    return validate;
  }

  const handleInputChangeRow = (index, field, value) => { //CAMBIO DE INPUTS EN EL EDIT DE ITEMS BAREMABLES
    const newItems = [...itemsBaremablesEdit];
    newItems[index] = { ...newItems[index], [field]: value };
    setItemsBaremablesEdit(newItems);
  };

  const handleSaveRow = (index) => { //GUARDAR FILA ITEM BAREMABLE
    const newItems = [...itemsBaremables];
    newItems[index] = itemsBaremablesEdit[index];
    setItemsBaremables(newItems);
    setEditRows(editRows.filter((i) => i !== index));
  };

  const beforeUpload = (file) => { //COMPROBAR EXTENSION
    const isPng =
      file.type === "image/png" ||
      file.type === "application/pdf" ||
      file.type === "image/jpeg";
    if (!isPng) {
      message.error("Solo puedes subir archivos PNG!");
    }
    return isPng || Upload.LIST_IGNORE;
  };

  React.useEffect(() => { //MANEJO DE FILTROS
    if (filterText !== "" || filterPais.length > 0 || filterTipo !== "") {
      let convocatoriaFilter = convocatorias;

      if (filterText !== "") {
        convocatoriaFilter = convocatoriaFilter.filter((item) =>
          item.titulo.toLowerCase().includes(filterText.toLowerCase())
        );
      }

      if (filterPais.length > 0) {
        convocatoriaFilter = convocatoriaFilter.filter((item) =>
          filterPais.every((pais) => item.paises.includes(pais))
        );
      }

      if (filterTipo !== "") {
        convocatoriaFilter = convocatoriaFilter.filter(
          (item) =>
            item.tipoMovilidad.toLowerCase() === filterTipo.toLowerCase()
        );
      }

      setConvocatoriasFiltered(convocatoriaFilter);
    } else {
      setConvocatoriasFiltered(convocatorias);
    }
  }, [filterText, filterPais, filterTipo, convocatorias]);

  return (
    <>
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
            <Grid
              item
              xs={
                roles.includes("ROLE_ADMIN") || solicitudConvocatoriaDisplay
                  ? 10
                  : 12
              }
            >
              {editarConvocatoria ? (//CAMBIO DE TITULO DEPENDIENDO DE LA VISTA
                <h3>Editar Convocatoria</h3>
              ) : crearConvocatoriaDisplay ? (
                <h3>Crear Convocatoria</h3>
              ) : solicitudConvocatoriaDisplay ? (
                <h3>Solicitud - {solicitudItem.titulo}</h3>
              ) : (
                <h3>Listado Convocatorias</h3>
              )}
            </Grid>

            {roles.includes("ROLE_ADMIN") ? (// SI ES ADMIN BOTON PARA CREAR
              <Grid
                item
                xs={2}
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Crear Convocatoria">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={
                      crearConvocatoriaDisplay ||
                      editarConvocatoria ||
                      solicitudConvocatoriaDisplay ? (
                        <UnorderedListOutlined />
                      ) : !crearConvocatoriaDisplay ? (
                        <PlusOutlined />
                      ) : (
                        <></>
                      )
                    }
                    onClick={changeCrearConvocatoriaDisplay}
                  />
                </Tooltip>
              </Grid>
            ) : solicitudConvocatoriaDisplay ?(
              <Grid
                item
                xs={2}
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Volver">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={
                      <UnorderedListOutlined />
                    }
                    onClick={changeCrearConvocatoriaDisplay}
                  />
                </Tooltip>
              </Grid>
            ):(<></>)}

            
            {!crearConvocatoriaDisplay &&
            !solicitudConvocatoriaDisplay &&
            !editarConvocatoria ? ( // INPUT FILTROS
              <>
                <Grid item xs={5.5} md={4}>
                  <Form.Control
                    onChange={(e) => setFilterText(e.target.value)}
                    value={filterText}
                    placeholder="Titulo Convocatoria"
                    style={{ width: "100%" }}
                  ></Form.Control>
                </Grid>

                <Grid item xs={1}></Grid>

                <Grid item xs={5.5} md={4}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Paises"
                    value={filterPais}
                    options={[
                      { label: "Italia", value: "Italia" },
                      { label: "Alemania", value: "Alemania" },
                      {
                        label: "Republica Checa",
                        value: "Republica Checa",
                      },
                      { label: "Irlanda", value: "Irlanda" },
                    ]}
                    style={{ width: "100%", height: "100%" }}
                    onChange={(e) => {
                      setFilterPais(e);
                    }}
                  />
                </Grid>

                <Grid item md={1}></Grid>

                <Grid item xs={12} md={2}>
                  <Select
                    onChange={(e) => setFilterTipo(e)}
                    placeholder="Tipo de Convocatoria"
                    options={[
                      {
                        value: "",
                        label: "Todos los tipos",
                      },
                      { value: "Corta", label: "Corta" },
                      { value: "Larga", label: "Larga" },
                      {
                        value: "Job Shadowing",
                        label: "Job Shadowing",
                      },
                      {
                        value: "Acompañamiento",
                        label: "Acompañamiento",
                      },
                    ]}
                    value={filterTipo}
                    style={{ width: "100%", height: "100%" }}
                  ></Select>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
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
            {solicitudConvocatoriaDisplay ? ( //Vista para hacer solicitud
              <Grid item xs={12} style={{ paddingLeft: "20px" }}>
                <Scrollbars autoHeight autoHeightMin={"71vh"} autoHide>
                  <Grid container columnGap={2} rowGap={2}>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Titulo</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Form.Control
                            value={solicitudItem.titulo}
                            disabled={true}
                            style={{ width: "100%" }}
                          ></Form.Control>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Tipo de Movilidad</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Form.Control
                            value={solicitudItem.tipoMovilidad}
                            disabled={true}
                            style={{ width: "100%" }}
                          ></Form.Control>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Número de movilidades</span>
                        </Grid>
                        <Grid item xs={12}>
                          <InputNumber
                            defaultValue={solicitudItem.numMovilidades}
                            disabled={true}
                            style={{ width: "100%" }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Paises</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Selecciona los paises de la convocatoria"
                            value={solicitudItem.paises}
                            disabled={true}
                            style={{ width: "100%" }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(solicitudItem.fechaInicio)}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(solicitudItem.fechaFin)}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio Inscripción</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              solicitudItem.fechaInscripcionInicio
                            )}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin Inscripción</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              solicitudItem.fechaInscripcionFin
                            )}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Lista Provisional</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              solicitudItem.fechaListaProvisional
                            )}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio Apelaciones</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              solicitudItem.fechaApelacionesInicio
                            )}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin Apelaciones</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              solicitudItem.fechaApelacionesFin
                            )}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11.25} md={5.75}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Lista Final</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(solicitudItem.fechaListaFinal)}
                            style={{ width: "100%" }}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={11.25}
                      md={11.7}
                      style={{ marginTop: "15px" }}
                    >
                      <Grid container rowGap={2}>
                        <Grid item xs={12}>
                          <span>Items Baremables</span>
                        </Grid>
                        <Grid item xs={12}>
                          <table className="tablaItemsSolicitud">
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Subida Archivos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {solicitudItem.itemsBaremables.map(
                                (itemBaremable) => {
                                  return itemBaremable.presentaUser ? (
                                    <tr>
                                      <td>
                                        {itemBaremable.nombre}
                                        {itemBaremable.obligatorio ? (
                                          <></>
                                        ) : (
                                          <span style={{ color: "red" }}>
                                            (*)
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <Upload
                                          beforeUpload={beforeUpload}
                                          maxCount={1}
                                          onChange={(info) => {
                                            addItemBaremable(
                                              itemBaremable.id,
                                              info.fileList[0].originFileObj
                                            );
                                          }}
                                        >
                                          <Button icon={<UploadOutlined />}>
                                            Subir
                                          </Button>
                                        </Upload>
                                      </td>
                                    </tr>
                                  ) : (
                                    <></>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={11.25}
                      md={11.7}
                      style={{ marginTop: "15px" }}
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
                        onClick={tryRequest}
                      >
                        Hacer Solicitud
                      </Button>
                    </Grid>
                  </Grid>
                </Scrollbars>
              </Grid>
            ) : crearConvocatoriaDisplay ? ( //Vista para crear solicitud
              <Grid item xs={12} style={{ paddingLeft: "20px" }}>
                <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                  {!loadingCrear ? (
                    crearConvocatoriaPage == 1 ? (
                      <Grid container columnGap={2} rowGap={2}>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Titulo</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Form.Control
                                onChange={(e) =>
                                  changeConvocatoria("titulo", e.target.value)
                                }
                                style={
                                  error
                                    ? crearConvocatoria.titulo
                                      ? {}
                                      : { border: "1px solid red" }
                                    : {}
                                }
                              ></Form.Control>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Tipo de Movilidad</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Select
                                onChange={(e) =>
                                  changeConvocatoria("tipoMovilidad", e)
                                }
                                options={[
                                  { value: "Corta", label: "Corta" },
                                  { value: "Larga", label: "Larga" },
                                  {
                                    value: "Job Shadowing",
                                    label: "Job Shadowing",
                                  },
                                  {
                                    value: "Acompañamiento",
                                    label: "Acompañamiento",
                                  },
                                ]}
                                style={
                                  error
                                    ? crearConvocatoria.tipoMovilidad
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          borderRadius: "8px",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                              ></Select>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Número de movilidades</span>
                            </Grid>
                            <Grid item xs={12}>
                              <InputNumber
                                min={0}
                                defaultValue={0}
                                onChange={(e) =>
                                  changeConvocatoria("numMovilidades", e)
                                }
                                style={
                                  error
                                    ? crearConvocatoria.numMovilidades
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Paises</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Select
                                mode="multiple"
                                allowClear
                                placeholder="Selecciona los paises de la convocatoria"
                                options={[
                                  { label: "Italia", value: "Italia" },
                                  { label: "Alemania", value: "Alemania" },
                                  {
                                    label: "Republica Checa",
                                    value: "Republica Checa",
                                  },
                                  { label: "Irlanda", value: "Irlanda" },
                                ]}
                                onChange={(e) =>
                                  changeConvocatoria("paises", e)
                                }
                                style={
                                  error
                                    ? crearConvocatoria.paises
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          borderRadius: "8px",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Inicio</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaInicio",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                style={
                                  error
                                    ? crearConvocatoria.fechaInicio
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Fin</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaFin",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                style={
                                  error
                                    ? crearConvocatoria.fechaFin
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                minDate={
                                  crearConvocatoria.fechaInicio
                                    ? dayjs(
                                        crearConvocatoria.fechaInicio,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Inicio Inscripción</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaInscripcionInicio
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaInscripcionInicio",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaInicio
                                    ? dayjs(
                                        crearConvocatoria.fechaInicio,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Fin Inscripción</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaInscripcionFin
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaInscripcionFin",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaInscripcionInicio
                                    ? dayjs(
                                        crearConvocatoria.fechaInscripcionInicio,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Lista Provisional</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaListaProvisional
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaListaProvisional",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaInscripcionFin
                                    ? dayjs(
                                        crearConvocatoria.fechaInscripcionFin,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Inicio Apelaciones</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaApelacionesInicio
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaApelacionesInicio",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaListaProvisional
                                    ? dayjs(
                                        crearConvocatoria.fechaListaProvisional,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Fin Apelaciones</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaApelacionesFin
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaApelacionesFin",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaApelacionesInicio
                                    ? dayjs(
                                        crearConvocatoria.fechaApelacionesInicio,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item  md={5.75} xs={10.25}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Fecha Lista Final</span>
                            </Grid>
                            <Grid item xs={12}>
                              <DatePicker
                                style={
                                  error
                                    ? crearConvocatoria.fechaListaFinal
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                                onChange={(e) =>
                                  changeConvocatoria(
                                    "fechaListaFinal",
                                    dayjs(e).format("DD/MM/YYYY")
                                  )
                                }
                                minDate={
                                  crearConvocatoria.fechaApelacionesFin
                                    ? dayjs(
                                        crearConvocatoria.fechaApelacionesFin,
                                        dateFormat
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={10.25} md={11.7}>
                          <Grid container>
                            <Grid item xs={12}>
                              <span>Coordinador</span>
                            </Grid>
                            <Grid item xs={12}>
                              <Select
                                onChange={(e) =>
                                  changeConvocatoria("idCoordinador", e)
                                }
                                options={coordinadoresOption}
                                style={
                                  error
                                    ? crearConvocatoria.idCoordinador
                                      ? { width: "100%" }
                                      : {
                                          border: "1px solid red",
                                          borderRadius: "8px",
                                          width: "100%",
                                        }
                                    : { width: "100%" }
                                }
                              ></Select>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={10.25} md={11.7} style={{ marginTop: "15px" }}>
                          <Button
                            type="primary"
                            className="loginButton"
                            style={{
                              width: "100%",
                              backgroundColor: "#004494",
                              border: "0px",
                              boxShadow: "0px",
                            }}
                            onClick={() => setCrearConvocatoriaPage(2)}
                          >
                            Siguente
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container columnGap={2} rowGap={2}>
                        <Grid item xs={10.25} md={5.75}>
                          <h5>Items Baremables</h5>
                        </Grid>
                        <Grid item xs={5.75}></Grid>
                        <Grid item xs={12}>
                          <Grid container columnGap={5}>
                            <Grid item xs={10.25} md={2}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <span>Nombre</span>
                                </Grid>
                                <Grid item xs={12}>
                                  <Form.Control
                                    onChange={(e) =>
                                      changeItemBaremable(
                                        "nombre",
                                        e.target.value
                                      )
                                    }
                                    value={crearItemBaremable.nombre}
                                    style={
                                      rowError
                                        ? crearItemBaremable.nombre == ""
                                          ? { border: "1px solid red" }
                                          : {}
                                        : {}
                                    }
                                  ></Form.Control>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              xs={10.25} md={2}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                Obligatorio
                              </span>
                              <Switch
                                value={
                                  crearItemBaremable.obligatorio == "SI"
                                    ? true
                                    : false
                                }
                                onClick={(e) => {
                                  changeItemBaremable(
                                    "obligatorio",
                                    e ? "SI" : "NO"
                                  );
                                }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={10.25} md={2}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                Presenta Usuario
                              </span>
                              <Switch
                                value={
                                  crearItemBaremable.presenta_user == "SI"
                                    ? true
                                    : false
                                }
                                onClick={(e) => {
                                  changeItemBaremable(
                                    "presenta_user",
                                    e ? "SI" : "NO"
                                  );
                                }}
                              />
                            </Grid>
                            <Grid item xs={10.25} md={1.5}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <span>Valor Mínimo</span>
                                </Grid>
                                <Grid item xs={12}>
                                  <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    value={crearItemBaremable.valor_min}
                                    style={
                                      rowError
                                        ? crearItemBaremable.valor_min < 0
                                          ? {
                                              border: "1px solid red",
                                              width: "100%",
                                            }
                                          : { width: "100%" }
                                        : { width: "100%" }
                                    }
                                    onChange={(e) => {
                                      changeItemBaremable("valor_min", e);
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={10.25} md={1.5}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <span>Valor Máximo</span>
                                </Grid>
                                <Grid item xs={12}>
                                  <InputNumber
                                    min={crearItemBaremable.valor_min}
                                    value={
                                      crearItemBaremable.valor_min >
                                      crearItemBaremable.valor_max
                                        ? crearItemBaremable.valor_min
                                        : crearItemBaremable.valor_max
                                    }
                                    defaultValue={0}
                                    style={
                                      rowError
                                        ? crearItemBaremable.valor_max <
                                          crearItemBaremable.valor_min
                                          ? {
                                              border: "1px solid red",
                                              width: "100%",
                                            }
                                          : { width: "100%" }
                                        : { width: "100%" }
                                    }
                                    onChange={(e) => {
                                      changeItemBaremable("valor_max", e);
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              md={0.5}
                              xs={5.10}
                              style={{
                                display: "flex",
                                justifyContent: "right",
                                alignItems: "center",
                              }}
                            >
                              <Tooltip title="Añadir Item Baremable">
                                <Button
                                  type="primary"
                                  shape="circle"
                                  icon={<PlusOutlined />}
                                  onClick={() => {
                                    addRow();
                                  }}
                                />
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={11.7} style={{ marginTop: "15px" }}>
                          <table
                            className={
                              errorItems
                                ? "tablaItemsBaremables tabla-vacia"
                                : "tablaItemsBaremables "
                            }
                          >
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Obligatorio</th>
                                <th>Presenta Usuario</th>
                                <th>Valor Mínimo</th>
                                <th>Valor Máximo</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemsBaremables && itemsBaremables.length > 0 ? (
                                itemsBaremables.map((item, index) => {
                                  const isEditing = editRows.includes(index);
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {isEditing ? (
                                          <Form.Control
                                            value={
                                              itemsBaremablesEdit[index].nombre
                                            }
                                            onChange={(e) =>
                                              handleInputChangeRow(
                                                index,
                                                "nombre",
                                                e.target.value
                                              )
                                            }
                                          />
                                        ) : (
                                          item.nombre
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <Switch
                                            checked={
                                              itemsBaremablesEdit[index]
                                                .obligatorio === "SI"
                                            }
                                            onChange={(checked) =>
                                              handleInputChangeRow(
                                                index,
                                                "obligatorio",
                                                checked ? "SI" : "NO"
                                              )
                                            }
                                          />
                                        ) : (
                                          item.obligatorio
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <Switch
                                            checked={
                                              itemsBaremablesEdit[index]
                                                .presenta_user === "SI"
                                            }
                                            onChange={(checked) =>
                                              handleInputChangeRow(
                                                index,
                                                "presenta_user",
                                                checked ? "SI" : "NO"
                                              )
                                            }
                                          />
                                        ) : (
                                          item.presenta_user
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <InputNumber
                                            min={0}
                                            value={
                                              itemsBaremablesEdit[index]
                                                .valor_min
                                            }
                                            onChange={(value) =>
                                              handleInputChangeRow(
                                                index,
                                                "valor_min",
                                                value
                                              )
                                            }
                                          />
                                        ) : (
                                          item.valor_min
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <InputNumber
                                            min={
                                              itemsBaremablesEdit[index]
                                                .valor_min
                                            }
                                            value={
                                              itemsBaremablesEdit[index]
                                                .valor_max
                                            }
                                            onChange={(value) =>
                                              handleInputChangeRow(
                                                index,
                                                "valor_max",
                                                value
                                              )
                                            }
                                          />
                                        ) : (
                                          item.valor_max
                                        )}
                                      </td>
                                      <td>
                                        {isEditing ? (
                                          <>
                                            <button
                                              className="save-button"
                                              onClick={() =>
                                                handleSaveRow(index)
                                              }
                                            >
                                              Guardar
                                            </button>
                                            <button
                                              className="cancel-button"
                                              onClick={() =>
                                                setEditRows(
                                                  editRows.filter(
                                                    (i) => i !== index
                                                  )
                                                )
                                              }
                                            >
                                              Cancelar
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              className="edit-button"
                                              onClick={() =>
                                                setEditRows([
                                                  ...editRows,
                                                  index,
                                                ])
                                              }
                                            >
                                              Editar
                                            </button>
                                            <button
                                              className="delete-button"
                                              onClick={() =>
                                                setItemsBaremables(
                                                  itemsBaremables.filter(
                                                    (_, i) => i !== index
                                                  )
                                                )
                                              }
                                            >
                                              Eliminar
                                            </button>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="6" className="empty-message">
                                    No hay elementos disponibles
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </Grid>
                        <Grid item xs={5.75} style={{ marginTop: "15px" }}>
                          <Button
                            type="primary"
                            className="loginButton"
                            style={{
                              width: "100%",
                              backgroundColor: "#004494",
                              border: "0px",
                              boxShadow: "0px",
                            }}
                            onClick={() => setCrearConvocatoriaPage(1)}
                          >
                            Anterior
                          </Button>
                        </Grid>
                        <Grid item xs={5.75} style={{ marginTop: "15px" }}>
                          <Button
                            type="primary"
                            className="loginButton"
                            style={{
                              width: "100%",
                              backgroundColor: "#004494",
                              border: "0px",
                              boxShadow: "0px",
                            }}
                            onClick={tryCrearConvocatoria}
                          >
                            Crear Convocatoria
                          </Button>
                        </Grid>
                      </Grid>
                    )
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
                        <CircularProgress />
                      </Grid>
                    </Grid>
                  )}
                </Scrollbars>
              </Grid>
            ) : editarConvocatoria ? (//Vista para editar solicitud
              <Grid item xs={12} style={{ paddingLeft: "20px" }}>
                <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                  <Grid container columnGap={2} rowGap={2}>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Titulo</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Form.Control
                            onChange={(e) =>
                              changeEditConvocatoria("titulo", e.target.value)
                            }
                            value={editarConvocatoriaChanges.titulo}
                            style={
                              error
                                ? crearConvocatoria.titulo
                                  ? {}
                                  : { border: "1px solid red" }
                                : {}
                            }
                          ></Form.Control>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Tipo de Movilidad</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Form.Control
                            value={editarConvocatoriaChanges.tipoMovilidad}
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "tipoMovilidad",
                                e.target.value
                              )
                            }
                            style={
                              error
                                ? crearConvocatoria.tipoMovilidad
                                  ? {}
                                  : { border: "1px solid red" }
                                : {}
                            }
                          ></Form.Control>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Número de movilidades</span>
                        </Grid>
                        <Grid item xs={12}>
                          <InputNumber
                            min={0}
                            defaultValue={
                              editarConvocatoriaChanges.numMovilidades
                            }
                            onChange={(e) =>
                              changeEditConvocatoria("numMovilidades", e)
                            }
                            style={
                              error
                                ? crearConvocatoria.numMovilidades
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Paises</span>
                        </Grid>
                        <Grid item xs={12}>
                          <Select
                            mode="multiple"
                            allowClear
                            placeholder="Selecciona los paises de la convocatoria"
                            value={editarConvocatoriaChanges.paises}
                            options={[
                              { label: "Italia", value: "Italia" },
                              { label: "Alemania", value: "Alemania" },
                              {
                                label: "Republica Checa",
                                value: "Republica Checa",
                              },
                              { label: "Irlanda", value: "Irlanda" },
                            ]}
                            onChange={(e) =>
                              changeEditConvocatoria("paises", e)
                            }
                            style={
                              error
                                ? crearConvocatoria.paises
                                  ? { width: "100%" }
                                  : {
                                      border: "1px solid red",
                                      borderRadius: "8px",
                                      width: "100%",
                                    }
                                : { width: "100%" }
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            onChange={(e) =>
                              changeEditConvocatoria("fechaInicio", dayjs(e))
                            }
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaInicio
                            )}
                            style={
                              error
                                ? crearConvocatoria.fechaInicio
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaFin
                            )}
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaFin",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            style={
                              error
                                ? crearConvocatoria.fechaFin
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item  md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio Inscripción</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaInscripcionInicio
                            )}
                            style={
                              error
                                ? crearConvocatoria.fechaInscripcionInicio
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaInscripcionInicio",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaInicio
                                ? dayjs(editarConvocatoriaChanges.fechaInicio)
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item  md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin Inscripción</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaInscripcionFin
                            )}
                            style={
                              error
                                ? editarConvocatoriaChanges.fechaInscripcionFin
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaInscripcionFin",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaInscripcionInicio
                                ? dayjs(
                                    editarConvocatoriaChanges.fechaInscripcionInicio
                                  )
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Lista Provisional</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaListaProvisional
                            )}
                            style={
                              error
                                ? editarConvocatoriaChanges.fechaListaProvisional
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaListaProvisional",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaInscripcionFin
                                ? dayjs(
                                    editarConvocatoriaChanges.fechaInscripcionFin
                                  )
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Inicio Apelaciones</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaApelacionesInicio
                            )}
                            style={
                              error
                                ? editarConvocatoriaChanges.fechaApelacionesInicio
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaApelacionesInicio",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaListaProvisional
                                ? dayjs(
                                    editarConvocatoriaChanges.fechaListaProvisional
                                  )
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Fin Apelaciones</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaApelacionesFin
                            )}
                            style={
                              error
                                ? editarConvocatoriaChanges.fechaApelacionesFin
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaApelacionesFin",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaApelacionesInicio
                                ? dayjs(
                                    editarConvocatoriaChanges.fechaApelacionesInicio
                                  )
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={5.75} xs={11.25}>
                      <Grid container>
                        <Grid item xs={12}>
                          <span>Fecha Lista Final</span>
                        </Grid>
                        <Grid item xs={12}>
                          <DatePicker
                            defaultValue={dayjs(
                              editarConvocatoriaChanges.fechaListaFinal
                            )}
                            style={
                              error
                                ? editarConvocatoriaChanges.fechaListaFinal
                                  ? { width: "100%" }
                                  : { border: "1px solid red", width: "100%" }
                                : { width: "100%" }
                            }
                            onChange={(e) =>
                              changeEditConvocatoria(
                                "fechaListaFinal",
                                dayjs(e).format("DD/MM/YYYY")
                              )
                            }
                            minDate={
                              editarConvocatoriaChanges.fechaApelacionesFin
                                ? dayjs(
                                    editarConvocatoriaChanges.fechaApelacionesFin
                                  )
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>
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
                        onClick={tryEditConvocatoria}
                      >
                        Editar Convocatoria
                      </Button>
                    </Grid>
                  </Grid>
                </Scrollbars>
              </Grid>
            ) : loading ? (//Vista de Carga
              <Grid
                item
                xs={12}
                style={{
                  height: "65vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Cargando...</span>
              </Grid>
            ) : convocatoriasFiltered.length > 0 ? (// Con la arrray de convocatorias filtradas se hace el listado
              <Grid item xs={12}>
                <Scrollbars autoHeight autoHeightMin={"65vh"} autoHide>
                  <Grid container rowGap={5}>
                    {convocatoriasFiltered.map((item, index) =>
                      (roles.includes("ROLE_PROFESOR") &&
                        (item.tipoMovilidad == "Job Shadowing" ||
                          item.tipoMovilidad == "Acompañamiento")) ||
                      (roles.includes("ROLE_USER") &&
                        (item.tipoMovilidad == "Corta" ||
                          item.tipoMovilidad == "Larga")) ? (
                        <>
                          <Grid item xs={1}></Grid>
                          <Grid
                            item
                            md={roles.includes("ROLE_ADMIN")||roles.includes("ROLE_COORDINADOR")?9:10}
                            xs={10}
                            key={index}
                            style={{
                              color: "white",
                            }}
                            onClick={() => {
                              setSolicitudConvocatoriaDisplay(true);
                              setSolicitudItem(item);
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
                                md={6}
                                xs={12}
                                style={{ padding: "16px 20px" }}
                              >
                                <span>{item.titulo}</span>
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
                                  Fecha Limite Inscripción:{" "}
                                  {new Date(
                                    item.fechaInscripcionFin
                                  ).toLocaleDateString("es-ES")}
                                </span>
                              </Grid>
                              <Grid
                                item
                                md={6}
                                xs={12}
                                style={{ padding: "16px 20px" }}
                              >
                                <span>Tipo Movilidad:{item.tipoMovilidad}</span>
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
                                <span>{item.paises.join(", ")}</span>
                              </Grid>
                            </Grid>
                          </Grid>
                          {roles.includes("ROLE_ADMIN") ? (
                            <Grid item xs={12} md={2} style={{ display: "flex" }}>
                              <Grid container columnSpacing={2}>
                                {item.status !== "LISTADO FINAL" ? (
                                  <Grid
                                    item
                                    xs={4}
                                    md={4}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Tooltip
                                      title={
                                        item.status === "INSCRIPCIONES"
                                          ? "Sacar Listado Provisional"
                                          : "Sacar Listado Final"
                                      }
                                    >
                                      <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<OrderedListOutlined />}
                                        onClick={() => {
                                          if (item.status === "INSCRIPCIONES") {
                                            const today =
                                              moment().format("YYYY-MM-DD");
                                            const fechaListado = moment(
                                              item.fechaListaProvisional
                                            ).format("YYYY-MM-DD");

                                            if (today !== fechaListado) {
                                              tryListaProvisional(item.id);
                                            } else {
                                              Swal.fire({
                                                title: "Error",
                                                text: "No es posible hacer el listado dado que no es la fecha establecida.",
                                                icon: "error",
                                              });
                                            }
                                          } else {
                                            setShowFinalList(true);
                                            setFinalListId(item.id);
                                          }
                                        }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                ) : (
                                  <Grid item xs={4}
                                  md={4}></Grid>
                                )}
                                <Grid
                                  item
                                  xs={4}
                                  md={3}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tooltip title="Editar Convocatoria">
                                    <Button
                                      type="primary"
                                      shape="circle"
                                      icon={<EditOutlined />}
                                      onClick={() => {
                                        editarConvocatoriaFunction(item.id);
                                      }}
                                    />
                                  </Tooltip>
                                </Grid>
                                <Grid
                                  item
                                  xs={4}
                                  md={3}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tooltip title="Eliminar Convocaoria">
                                    <Button
                                      type="primary"
                                      shape="circle"
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        deleteConvocatoria(item.id);
                                      }}
                                    />
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Grid>
                          ) : roles.includes("ROLE_COORDINADOR")?(
                            <Grid item xs={12} md={2} style={{ display: "flex" }}>
                              <Grid container columnSpacing={2}>
                                {item.status !== "LISTADO FINAL" ? (
                                  <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Tooltip
                                      title={
                                        item.status === "INSCRIPCIONES"
                                          ? "Sacar Listado Provisional"
                                          : "Sacar Listado Final"
                                      }
                                    >
                                      <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<OrderedListOutlined />}
                                        onClick={() => {
                                          if (item.status === "INSCRIPCIONES") {
                                            const today =
                                              moment().format("YYYY-MM-DD");
                                            const fechaListado = moment(
                                              item.fechaListaProvisional
                                            ).format("YYYY-MM-DD");

                                            if (today !== fechaListado) {
                                              tryListaProvisional(item.id);
                                            } else {
                                              Swal.fire({
                                                title: "Error",
                                                text: "No es posible hacer el listado dado que no es la fecha establecida.",
                                                icon: "error",
                                              });
                                            }
                                          } else {
                                            setShowFinalList(true);
                                            setFinalListId(item.id);
                                          }
                                        }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                ) : (
                                  <Grid item xs={4}
                                  md={4}></Grid>
                                )}
                              </Grid>
                            </Grid>
                          ):(<Grid item xs={1}></Grid>)}
                        </>
                      ) : (
                        <></>
                      )
                    )}
                  </Grid>
                </Scrollbars>
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                style={{
                  height: "65vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>No existen convocatorias con los datos aportados.</span>
              </Grid>
            )}
            {showFinalList ? (//Vista para hacer listado final
              <FinalList
                idConvocatoria={finalListId}
                showFinalList={showFinalList}
                setShowFinalList={setShowFinalList}
              />
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
