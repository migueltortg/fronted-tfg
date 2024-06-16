"use client";

import { Grid } from "@mui/material";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import useAuth from "./components/useAuth";
import Nav from "./components/Nav";

export default function Home() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    roles,
    nombre,
  } = useAuth();
  
  return (
    <>
      <Grid container>
        <Nav
          isAuthenticated={isAuthenticated}
          roles={roles}
          nombre={nombre}
        ></Nav>
        <Grid item xs={12} style={{ padding: "16px 20px" }}>
          <Grid container rowGap={1}>
            <Grid
              item
              xs={12}
              style={{ textAlign: "center", color: "#004494" }}
            >
              <h3 style={{ fontWeight: "bold", fontSize: "44px" }}>
                Becas Erasmus+ <br /> I.E.S Las Fuentezuelas
              </h3>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Carousel autoPlay interval={15000} infiniteLoop width={"50vw"}>
                <div>
                  <img src="/img/carrusel/logoErasmus.png" alt="Erasmus 2020 Praga" />
                  <p className="legend">Erasmus 2020 Praga</p>
                </div>
                <div>
                  <img src="/img/carrusel/logoErasmus.png" alt="Erasmus 2022 Alemania" />
                  <p className="legend">Erasmus 2022 Alemania</p>
                </div>
                <div>
                  <img src="/img/carrusel/logoErasmus.png" alt="Erasmus 2024 Italia" />
                  <p className="legend">Erasmus 2024 Italia</p>
                </div>
              </Carousel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container style={{ padding: "16px 10vw" }} rowGap={3}>
            <Grid item xs={12}>
              <h4
                style={{
                  fontSize: "39px",
                  color: "#004494",
                  fontWeight: "bold",
                }}
              >
                ¿Qué es la beca Erasmus?
              </h4>
            </Grid>
            <Grid item xs={12}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                finibus purus vel neque maximus cursus. Cras a ipsum vitae risus
                convallis porta. In lectus neque, dapibus vel erat ut, maximus
                ullamcorper leo. Ut quis dapibus purus. Sed in malesuada tellus.
                Maecenas posuere vel risus id elementum. Quisque ac dictum
                metus. Morbi quis maximus risus. Vivamus cursus massa quam, ut
                tempus leo porttitor vitae. Cras a mauris sapien. Sed rutrum
                ornare massa in tempor.
              </p>
              <p>
                Pellentesque nec odio vitae diam euismod sodales. Vivamus eu
                nisl ullamcorper, blandit nisi sit amet, finibus urna. Vivamus
                auctor scelerisque lorem, sed eleifend risus sagittis vitae.
                Morbi et mattis nisl, et vulputate metus. Donec molestie, ipsum
                at eleifend ornare, neque risus congue velit, iaculis sagittis
                sapien sem eget felis. Nulla convallis dictum lorem, mattis
                consequat enim pharetra at. Curabitur in nulla nibh. Curabitur
                at libero quis ex vestibulum scelerisque. Donec eu rhoncus
                mauris, sed ultricies eros. Integer elementum tortor sit amet
                sapien vestibulum, id pretium velit vulputate. Nullam sem
                libero, aliquet aliquet velit vel, venenatis placerat ipsum.
              </p>
              <p>
                Pellentesque pellentesque nisl pulvinar massa malesuada
                fringilla. Mauris sit amet neque non elit lacinia dapibus. Morbi
                quis fringilla est. Duis euismod commodo orci. Pellentesque
                pretium euismod mauris et scelerisque. Sed quis arcu euismod
                magna interdum vulputate id eget libero. Nunc sed faucibus erat.
                In molestie fringilla magna, a faucibus nulla dignissim ac.
                Nulla viverra consectetur massa ut ultricies. Pellentesque eu
                condimentum orci. Aliquam erat volutpat. Cras rhoncus dui non
                orci facilisis, ac rutrum nibh malesuada. Quisque in diam quam.
                Pellentesque a pellentesque tellus. Integer sollicitudin nibh
                diam, quis malesuada mi aliquet ut.
              </p>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "5vh" }}>
          <Grid container style={{ padding: "16px 10vw" }} rowGap={3}>
            <Grid item xs={12}>
              <h4
                style={{
                  fontSize: "39px",
                  color: "#004494",
                  fontWeight: "bold",
                }}
              >
                ¿Quienes pueden pedir la beca Erasmus?
              </h4>
            </Grid>
            <Grid item xs={12}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                finibus purus vel neque maximus cursus. Cras a ipsum vitae risus
                convallis porta. In lectus neque, dapibus vel erat ut, maximus
                ullamcorper leo. Ut quis dapibus purus. Sed in malesuada tellus.
                Maecenas posuere vel risus id elementum. Quisque ac dictum
                metus. Morbi quis maximus risus. Vivamus cursus massa quam, ut
                tempus leo porttitor vitae. Cras a mauris sapien. Sed rutrum
                ornare massa in tempor.
              </p>
              <p>
                Pellentesque nec odio vitae diam euismod sodales. Vivamus eu
                nisl ullamcorper, blandit nisi sit amet, finibus urna. Vivamus
                auctor scelerisque lorem, sed eleifend risus sagittis vitae.
                Morbi et mattis nisl, et vulputate metus. Donec molestie, ipsum
                at eleifend ornare, neque risus congue velit, iaculis sagittis
                sapien sem eget felis. Nulla convallis dictum lorem, mattis
                consequat enim pharetra at. Curabitur in nulla nibh. Curabitur
                at libero quis ex vestibulum scelerisque. Donec eu rhoncus
                mauris, sed ultricies eros. Integer elementum tortor sit amet
                sapien vestibulum, id pretium velit vulputate. Nullam sem
                libero, aliquet aliquet velit vel, venenatis placerat ipsum.
              </p>
              <p>
                Pellentesque pellentesque nisl pulvinar massa malesuada
                fringilla. Mauris sit amet neque non elit lacinia dapibus. Morbi
                quis fringilla est. Duis euismod commodo orci. Pellentesque
                pretium euismod mauris et scelerisque. Sed quis arcu euismod
                magna interdum vulputate id eget libero. Nunc sed faucibus erat.
                In molestie fringilla magna, a faucibus nulla dignissim ac.
                Nulla viverra consectetur massa ut ultricies. Pellentesque eu
                condimentum orci. Aliquam erat volutpat. Cras rhoncus dui non
                orci facilisis, ac rutrum nibh malesuada. Quisque in diam quam.
                Pellentesque a pellentesque tellus. Integer sollicitudin nibh
                diam, quis malesuada mi aliquet ut.
              </p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
