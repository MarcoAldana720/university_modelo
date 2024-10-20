"use client";

import { useRouter, usePathname } from "next/navigation";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function Profile({ show, userData }) {
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    us_nombres: "",
    us_apellidos: "",
    us_usuario: "",
    us_correo: "",
    us_contrasena: "",
  });

  // Cargar los datos del usuario en el formulario cuando se abra el modal
  useEffect(() => {
    if (userData) {
      setFormData({
        us_nombres: userData.us_nombres || "",
        us_apellidos: userData.us_apellidos || "",
        us_usuario: userData.us_usuario || "",
        us_correo: userData.us_correo || "",
        us_contrasena: "",
      });
    }
  }, [userData]);

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario para actualizar los datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      // No enviar el campo de contraseña si está vacío
      if (!formData.us_contrasena) {
        delete updatedData.us_contrasena;
      }

      await axios.put('/api/auth/profile', updatedData, { withCredentials: true });
      toast.success("Datos Actualizados Exitosamente");
      router.push(pathname); // Redirigir a la misma ruta

      // Después de actualizar, limpiar el campo de contraseña para que quede vacío
      setFormData((prevData) => ({
        ...prevData,
        us_contrasena: "",
      }));
    } catch (error) {
      toast.error("No Se Pudo Actualizar Los Datos");
    }
  };

  const closeModal = () => {
    // Aquí puedes manejar la lógica para cerrar el modal
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar" >
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="us_nombres">nombre(s):</label><br />
            <input type="text" name="us_nombres" id="us_nombres" value={formData.us_nombres} onChange={handleChange} required /><br />

            <label htmlFor="us_apellidos">apellido(s):</label><br />
            <input type="text" name="us_apellidos" id="us_apellidos" value={formData.us_apellidos} onChange={handleChange} required /><br />

            <label htmlFor="us_usuario">usuario:</label><br />
            <input type="text" name="us_usuario" id="us_usuario" value={formData.us_usuario} onChange={handleChange} required /><br />

            <label htmlFor="us_correo">correo:</label><br />
            <input type="email" name="us_correo" id="us_correo" value={formData.us_correo} onChange={handleChange} required /><br />

            <label htmlFor="us_contrasena">contraseña:</label><br />
            <input type="password" name="us_contrasena" id="us_contrasena" value={formData.us_contrasena} onChange={handleChange} />

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
