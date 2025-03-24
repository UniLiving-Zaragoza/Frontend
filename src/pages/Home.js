import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoGrande from "../assets/LogoGrande.png";

const HomePage = () => {
  return (
    <div className="container text-center mt-5">
      {/* Logo */}
      <div className="d-flex justify-content-center mb-4">
        <img src={LogoGrande} alt="UniLiving Logo" className="img-fluid" style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }} />
      </div>
      
      {/* Botón de explorar */}
      <button className="btn px-4 py-2 mb-4" style={{ borderRadius: "25px", backgroundColor: "#000842", color: "white" }}>
        EXPLORAR
      </button>
      
      {/* Área de información */}
      <div className="row">
        <div className="col-md-4 p-2">
          <div className="card p-4 text-center w-100" style={{ backgroundColor: "#D6EAFF", height: "200px" }}>
            Área de información
          </div>
        </div>
        <div className="col-md-4 p-2">
          <div className="card p-4 text-center w-100" style={{ backgroundColor: "#D6EAFF", height: "200px" }}>
            Área de información
          </div>
        </div>
        <div className="col-md-4 p-2">
          <div className="card p-4 text-center w-100" style={{ backgroundColor: "#D6EAFF", height: "200px" }}>
            Área de información
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;