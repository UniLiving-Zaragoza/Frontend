import React, { useState } from 'react';
import Register from './Register';
import RegisterInfo from './RegisterInfo';

function RegisterFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Datos de Register.js
    email: '',
    password: '',
    confirmPassword: '',
    
    // Datos de RegisterInfo.js
    nombre: '',
    apellidos: '',
    edad: '',
    genero: '',
    pais: '',
    descripcion: '',
    estadoLaboral: '',
    fumador: '',
    duracionEstancia: '',
    mascotas: '',
    frecuenciaVisitas: '',
    zonasBusqueda: '',
    preferenciaConvivencia: '',
    interesesHobbies: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFormChange = (updatedData) => {
    setFormData(prevData => ({ ...prevData, ...updatedData }));
  };

  return (
    <>
      {step === 1 && (
        <Register
          formData={formData}
          onFormChange={handleFormChange}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <RegisterInfo
          formData={formData}
          onFormChange={handleFormChange}
          prevStep={prevStep}
        />
      )}
    </>
  );
}

export default RegisterFlow;