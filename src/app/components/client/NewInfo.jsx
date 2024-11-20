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
      const res = await axios.post('/api/admin', dataObject);// Cambiarlo A La API Correspondiente
      toast.success(res.data.message || 'Usuario Registrado Exitosamente');
      router.push("/client/identify");
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
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="ip_curp">clave única de registro de población (CURP):</label><br />
            <input type="text" name="ip_curp" id="ip_curp" required/><br />

            <label htmlFor="ip_rfc">registro federal de contribuyente (RFC):</label><br />
            <input type="text" name="ip_rfc" id="ip_rfc" required/><br />

            <label htmlFor="ip_fecha_nacimiento">fecha de nacimiento:</label><br />
            <input type="date" name="ip_fecha_nacimiento" id="ip_fecha_nacimiento" required/><br />

            <label htmlFor="ip_nacionalidad">nacionalidad:</label><br />
            <input type="text" name="ip_nacionalidad" id="ip_nacionalidad" required/><br />

            <label htmlFor="ip_entidad">entidad de nacimiento:</label><br />
            <input type="email" name="ip_entidad" id="ip_entidad" required/><br />

            <label htmlFor="ip_estado_civil">estado civil:</label><br />
            <select name="ip_estado_civil" id="ip_estado_civil" required>
              <option value="">selecciona una opción</option>
              <option value="1">casado (a)</option>
              <option value="2">soltero (a)</option>
            </select><br />

            <label htmlFor="ip_telefono">celular:</label><br />
            <input type="tel" name="ip_telefono" id="ip_telefono" required/><br />

            <label htmlFor="ip_email">correo electronico:</label><br />
            <input type="email" name="ip_email" id="ip_email" required/><br />

            <label htmlFor="ip_email_alternativo">correo electronico adicional:</label><br />
            <input type="email" name="ip_email_alternativo" id="ip_email_alternativo" required/><br />

            <label htmlFor="ip_area_dedicacion">área a la que se dedica:</label><br />
            <select name="ip_area_dedicacion" id="ip_area_dedicacion" required>
              <option value="">selecciona una opción</option>
              <option value="1">arquitectura</option>
              <option value="2">derecho</option>
              <option value="3">diseño</option>
              <option value="4">humanidades</option>
              <option value="5">ingenieria</option>
              <option value="6">negocios</option>
              <option value="7">salud</option>
            </select><br />

            <label htmlFor="ip_desciplina_dedicacion">disciplina a la que se dedica:</label><br />
            <select name="ip_desciplina_dedicacion" id="ip_desciplina_dedicacion" required>
              <option value="">selecciona una opción</option>
              <option value="1">arquitectura</option>
              <option value="2">ingeniería arquitectónica</option>
              <option value="3">derecho</option>
              <option value="4">relaciones internacionales y alianzas estratégicas</option>
              <option value="5">bioconstrucción y diseño sustentable</option>
              <option value="6">diseño interactivo</option>
              <option value="7">diseño de moda</option>
              <option value="8">diseño e innovación</option>
              <option value="9">comunicación</option>
              <option value="10">lengua y literatura modernas</option>
              <option value="11">producción musical</option>
              <option value="12">ingeniería automotriz</option>
              <option value="13">ingeniería biomédica</option>
              <option value="14">ingeniería industrial logística</option>
              <option value="15">ingeniería mecatrónica</option>
              <option value="16">ingeniería en desarrollo de tecnología y software</option>
              <option value="17">ingeniería en energía y petróleo</option>
              <option value="18">administración y dirección financiera</option>
              <option value="19">administración y mercadotecnia estratégica</option>
              <option value="20">dirección de empresas y negocios internacionales</option>
              <option value="21">cirujano dentista</option>
              <option value="22">cultura física y entrenamiento deportivo</option>
              <option value="23">fisioterapia y rehabilitación</option>
              <option value="24">nutrición</option>
              <option value="25">psicología</option>
            </select><br />

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
