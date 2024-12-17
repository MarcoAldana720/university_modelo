"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import HelpIcon from "../../assets/HelpIcon";

export default function NewStudies({ show }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    try {
      const res = await axios.post('/api/client/studies', {
        est_nivel_estudios: dataObject.us_nivel,
        est_area_estudio: dataObject.us_area,
        est_disciplina_estudio: dataObject.us_disciplina,
        est_institucion_ortogante: dataObject.us_institucion,
        est_pais_institucion: dataObject.us_pais,
        est_fecha_obtencion_titulo: dataObject.us_fecha,
      });
      toast.success(res.data.message || 'Registro de estudios agregado exitosamente');
      router.push("/client/studies");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al agregar el registro de estudios');
    }
  }

  const closeModal = () => {
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="us_nivel">nivel de estudios *:
              <span className="tooltip-icon highlight-icon" data-tooltip="nivel académico alcanzado."><HelpIcon /></span>
            </label><br />
            <select name="us_nivel" id="us_nivel" required >
              <option value="">selecciona una opción</option>
              <option value="Doctorado">doctorado</option>
              <option value="Maestria">maestría</option>
              <option value="Licenciatura">licenciatura</option>
            </select><br />

            <label htmlFor="us_area">área *:
              <span className="tooltip-icon highlight-icon" data-tooltip="campo de estudio o disciplina principal."><HelpIcon /></span>
            </label><br />
            <select name="us_area" id="us_area" required >
              <option value="">selecciona una opción</option>
              <option value="Físico-matemáticas y ciencias de la tierra">I. físico-matemáticas y ciencias de la tierra</option>
              <option value="Biología y química">II. biología y química</option>
              <option value="Medicinas y ciencias de la salud">III. medicinas y ciencias de la salud</option>
              <option value="Ciencias de la conducta y la educación">IV. ciencias de la conducta y la educación</option>
              <option value="Humanidades">V. humanidades</option>
              <option value="Ciencias sociales">VI. ciencias sociales</option>
              <option value="Ciencias de agricultura, agropecuarias, forestales y de ecosistemas">VII. ciencias de agricultura, agropecuarias, forestales y de ecosistemas</option>
              <option value="Ingenieria y desarrollo tecnológico">VIII. ingenieria y desarrollo tecnológico</option>
              <option value="Interdisciplinaria">IX. interdisciplinaria</option>
            </select><br />

            <label htmlFor="us_disciplina">disciplina *:</label><br />
            <input type="text" name="us_disciplina" id="us_disciplina" required /><br />

            <label htmlFor="us_fecha">fecha de obtención del título o grado *:
              <span className="tooltip-icon highlight-icon" data-tooltip="fecha en que se emitió el título o grado."><HelpIcon /></span>
            </label><br />
            <input type="date" name="us_fecha" id="us_fecha" required /><br />

            <label htmlFor="us_institucion">institución otorgante:
              <span className="tooltip-icon highlight-icon" data-tooltip="nombre de la universidad o institución que otorgó el título o grado."><HelpIcon /></span>
            </label><br />
            <input type="text" name="us_institucion" id="us_institucion" required /><br />

            <label htmlFor="us_pais">país *:
              <span className="tooltip-icon highlight-icon" data-tooltip="país donde se encuentra la institución que emitió el título."><HelpIcon /></span>
            </label><br />
            <input type="text" name="us_pais" id="us_pais" required /><br />

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
