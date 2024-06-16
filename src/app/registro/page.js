"use client";

import { Grid } from "@mui/material";
import { Input, Button, theme } from "antd";
import React from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Scrollbars from "react-custom-scrollbars-2";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [surnames, setSurnames] = React.useState("");
  const [dni, setDNI] = React.useState("");
  const [tfno, setTfno] = React.useState("");
  const [adress, setAdress] = React.useState("");

  const [errorEmail, setErrorEmail] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorRepeatPassword, setErrorRepeatPassword] = React.useState(false);
  const [errorName, setErrorName] = React.useState(false);
  const [errorSurnames, setErrorSurnames] = React.useState(false);
  const [errorDni, setErrorDni] = React.useState(false);
  const [errorTfno, setErrorTfno] = React.useState(false);
  const [errorAdress, setErrorAdress] = React.useState(false);

  const [errors, setErrors] = React.useState([]);

  const router = useRouter();

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  function changeRepeatPassword(e) {
    setRepeatPassword(e.target.value);
  }

  function changeName(e) {
    setName(e.target.value);
  }

  function changeSurnames(e) {
    setSurnames(e.target.value);
  }

  function changeDNI(e) {
    setDNI(e.target.value);
  }

  function changeTfno(e) {
    setTfno(e.target.value);
  }

  function changeAdress(e) {
    setAdress(e.target.value);
  }

  function validarDNI(texto) {
    var dniRegex = /^\d{8}[a-zA-Z]$/;

    if (dniRegex.test(texto)) {
      var dniNumeros = texto.substring(0, 8);
      var dniLetra = texto.substring(8).toUpperCase();

      var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
      var letraEsperada = letras.charAt(dniNumeros % 23);

      if (letraEsperada === dniLetra) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function validarEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  function validarRegistro() {
    var validacion = true;
    var errores = [];

    if (!validarDNI(dni)) {
      validacion = false;
      setErrorDni(true);
      errores.push("Dni no válido.");
    } else {
      setErrorDni(false);
    }

    if (!validarEmail(email)) {
      validacion = false;
      setErrorEmail(true);
      errores.push("Email no válido.");
    } else {
      setErrorEmail(false);
    }

    if (name == "" || name == undefined || name == null) {
      validacion = false;
      setErrorName(true);
      errores.push("El nombre es obligatorio.");
    } else {
      setErrorName(false);
    }

    if (surnames == "" || surnames == undefined || surnames == null) {
      validacion = false;
      setErrorSurnames(true);
      errores.push("Los apellidos son obligatorios.");
    } else {
      setErrorSurnames(false);
    }

    if (tfno == "" || tfno.length < 9) {
      validacion = false;
      setErrorTfno(true);
      errores.push("Teléfono no válido.");
    } else {
      setErrorTfno(false);
    }

    if (adress == "" || adress == undefined || adress == null) {
      validacion = false;
      setErrorAdress(true);
      errores.push("La dirección es obligatoria.");
    } else {
      setErrorAdress(false);
    }

    if (password.length < 8) {
      validacion = false;
      setErrorPassword(true);
      errores.push("La contraseña ha de tener al menos 8 caracteres.");
    } else {
      setErrorPassword(false);
    }

    if (password !== repeatPassword) {
      validacion = false;
      setErrorRepeatPassword(true);
      errores.push("Las contraseñas han de coincidir.");
    } else if (repeatPassword == "") {
      validacion = false;
      setErrorRepeatPassword(true);
    } else {
      setErrorRepeatPassword(false);
    }

    setErrors(errores);
    return validacion;
  }

  const registerTry = async () => {
    console.log(validarRegistro());

    if (validarRegistro()) {
      var formData = new FormData();

      formData.append("name", name);
      formData.append("surnames", surnames);
      formData.append("dni", dni);
      formData.append("tfno", tfno);
      formData.append("email", email);
      formData.append("adress", adress);
      formData.append("password", password);
      formData.append("repeatPassword", repeatPassword);

      //Fetch Registro
      try {
        const response = await fetch("http://127.0.0.1:8000/api/register", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          if (data == "created") {
            toast.success("Te has registrado con exito!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            router.push("/login");
          }
        } else {
          console.log("error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  React.useEffect(() => {
    if (errors.length > 0) {
      var textError = "";
      errors.map((error) => {
        textError = textError + "<br>-" + error;
      });
      Swal.fire({
        title: "Necesitas solucionar los siguientes errores:",
        icon: "error",
        html: textError,
        showCloseButton: true,
      });
    }
  }, [errors]);

  return (
    <>
      <ToastContainer />

      <Grid container className="registroPage">
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
            <Grid item  xs={10} md={5} className="register_container">
              <Grid container rowGap={1}>
                <Grid item xs={12} className="register_tit">
                  <h3>
                    Erasmus + <br></br>I.E.S Las Fuentezuelas
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ margin: "16px 20px", marginTop: "0px" }}
                >
                  <Scrollbars autoHeight autoHeightMin={"30vh"} autoHide>
                    <Grid container rowGap={2}>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Nombre</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              className={
                                errorName ? "formInputError" : "formInput"
                              }
                              onChange={changeName}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Apellidos</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              className={
                                errorSurnames ? "formInputError" : "formInput"
                              }
                              onChange={changeSurnames}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>DNI</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              maxLength={9}
                              className={
                                errorDni ? "formInputError" : "formInput"
                              }
                              onChange={changeDNI}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Teléfono</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              maxLength={9}
                              className={
                                errorTfno ? "formInputError" : "formInput"
                              }
                              onChange={changeTfno}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Email</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              className={
                                errorEmail ? "formInputError" : "formInput"
                              }
                              onChange={changeEmail}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Domicilio / Dirección</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input
                              className={
                                errorAdress ? "formInputError" : "formInput"
                              }
                              onChange={changeAdress}
                            ></Input>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Contraseña</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input.Password
                              className={
                                errorPassword ? "formInputError" : "formInput"
                              }
                              onChange={changePassword}
                            ></Input.Password>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container rowGap={0.1}>
                          <Grid item xs={12} className="formTit">
                            <span>Repite la Contraseña</span>
                          </Grid>
                          <Grid item xs={12} className="formInputContainer">
                            <Input.Password
                              className={
                                errorRepeatPassword
                                  ? "formInputError"
                                  : "formInput"
                              }
                              onChange={changeRepeatPassword}
                            ></Input.Password>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Scrollbars>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "2%",
                  }}
                >
                  <Button
                    type="primary"
                    className="loginButton"
                    style={{
                      width: "50%",
                      backgroundColor: "#004494",
                      border: "0px",
                      boxShadow: "0px",
                    }}
                    onClick={registerTry}
                  >
                    Registrate
                  </Button>
                  <a href="/login" style={{ marginTop: "1%" }}>
                    Iniciar Sesión
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
