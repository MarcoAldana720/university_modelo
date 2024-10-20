"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';

export default function NewUser({show}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    try {
      const res = await axios.post('/api/admin', dataObject);
      toast.success(res.data.message || 'Usuario Registrado Exitosamente');
      router.push("/admin/usuarios");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error Al Registrar Usuario');
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
            <input type="text" name="us_nombres" id="us_nombres" required/><br />

            <label htmlFor="us_apellidos">apellido(s):</label><br />
            <input type="text" name="us_apellidos" id="us_apellidos" required/><br />

            <label htmlFor="us_gen_id">género:</label><br />
            <select name="us_gen_id" id="us_gen_id" required>
              <option value="">selecciona una opción</option>
              <option value="1">masculino</option>
              <option value="2">femenina</option>
            </select><br />

            <label htmlFor="us_usuario">usuario:</label><br />
            <input type="text" name="us_usuario" id="us_usuario" required/><br />

            <label htmlFor="us_correo">correo:</label><br />
            <input type="email" name="us_correo" id="us_correo" required/><br />

            <label htmlFor="us_rol_id">cargo:</label><br />
            <select name="us_rol_id" id="us_rol_id" required>
              <option value="">selecciona una opción</option>
              <option value="1">administrador</option>
              <option value="2">profesor</option>
            </select><br />

            <label htmlFor="us_esc_id">escuela:</label><br />
            <select name="us_esc_id" id="us_esc_id" required>
              <option value="">selecciona una opcion</option>
              <option value="1">arquitectura</option>
              <option value="2">derecho</option>
              <option value="3">diseño</option>
              <option value="4">humanidades</option>
              <option value="5">ingenieria</option>
              <option value="6">negocios</option>
              <option value="7">salud</option>
            </select><br />

            <div className="btn">
              <button type="submit">registrar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
