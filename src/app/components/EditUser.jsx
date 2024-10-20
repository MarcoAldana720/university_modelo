"use client"

import Modal from "./Modal";
import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from 'sonner';

async function loadUser(userId) {
  try {
    const { data } = await axios.get(`/api/admin/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error Al Cargar Los Datos Del Usuario.');
  }
}

export default function EditUser({ show }) {
  const pathname = usePathname();
  const { id } = useParams();
  const router = useRouter();

  const [info, setInfo] = useState({
    us_nombres: '',
    us_apellidos: '',
    us_usuario: '',
    us_correo: '',
    gen_id: '',
    rol_id: '',
    esc_id: '',
    es_id: ''
  });

  useEffect(() => {
    loadUser(id)
      .then((data) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form.entries());

    try {
      const res = await axios.put(`/api/admin/${id}`, dataObject);

      if (res.status !== 200) {
        throw new Error(res.data.message || 'Error Al Actualizar El Usuario.');
      }

      toast.success(res.data.message || 'Usuario Actualizado Exitosamente.');
      router.refresh();
      router.push('/admin/usuarios');
    } catch (error) {
      toast.error(error.message || 'Error Al Actualizar El usuario.');
    }
  }

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
            <input type="text" name="us_nombres" id="us_nombres" defaultValue={info.us_nombres} required /><br />

            <label htmlFor="us_apellidos">apellido(s):</label><br />
            <input type="text" name="us_apellidos" id="us_apellidos" defaultValue={info.us_apellidos} required /><br />

            <label htmlFor="us_gen_id">género:</label><br />
            <select name="us_gen_id" id="us_gen_id" defaultValue={info.gen_id}>
              <option value="">selecciona una opcion</option>
              <option value="1">masculino</option>
              <option value="2">femenina</option>
            </select><br />

            <label htmlFor="us_usuario">usuario:</label><br />
            <input type="text" name="us_usuario" id="us_usuario" defaultValue={info.us_usuario} required /><br />

            <label htmlFor="us_correo">correo:</label><br />
            <input type="email" name="us_correo" id="us_correo" defaultValue={info.us_correo} required /><br />

            <label htmlFor="us_rol_id">cargo:</label><br />
            <select name="us_rol_id" id="us_rol_id" defaultValue={info.rol_id} required>
              <option value="">selecciona una opcion</option>
              <option value="1">administrador</option>
              <option value="2">profesor</option>
            </select><br />

            <label htmlFor="us_esc_id">escuela:</label><br />
            <select name="us_esc_id" id="us_esc_id" defaultValue={info.esc_id} required>
              <option value="">selecciona una opcion</option>
              <option value="1">arquitectura</option>
              <option value="2">derecho</option>
              <option value="3">diseño</option>
              <option value="4">humanidades</option>
              <option value="5">ingenieria</option>
              <option value="6">negocios</option>
              <option value="7">salud</option>
            </select><br />

            <label htmlFor="us_es_id">estado:</label><br />
            <select name="us_es_id" id="us_es_id" defaultValue={info.es_id} required>
              <option value="">selecciona una opcion</option>
              <option value="1">alta</option>
              <option value="2">baja</option>
            </select>

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
