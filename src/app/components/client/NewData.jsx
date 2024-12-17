"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import HelpIcon from "../../assets/HelpIcon";

export default function NewDataFilter({show}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    try {
      const res = await axios.post('/api/client/employmentdata', {
        da_nombramiento: dataObject.da_nombramiento,
        da_escuela_pertenece: dataObject.da_escuela_pertenece,
        da_inicio_contrato: dataObject.da_inicio_contrato,
        da_hrs_contrato: dataObject.da_hrs_contrato,
        da_unidad: dataObject.da_unidad,
        da_campus: dataObject.da_campus,
      });

      toast.success(res.data.message || 'Registro de estudios agregado exitosamente');
      router.push("/client/employmentdata");
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
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar" >
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="da_nombramiento">nombramiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de contrato o cargo asignado."><HelpIcon /></span>
            </label><br />
            <input type="text" name="da_nombramiento" id="da_nombramiento" required/><br />

            <label htmlFor="da_escuela_pertenece">escuela a la que pertenece:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nombre de la escuela o facultad donde labora."><HelpIcon /></span>
            </label><br />
            <select name="da_escuela_pertenece" id="da_escuela_pertenece" required>
              <option value="">selecciona una opción</option>
              <option value="Arquitectura">arquitectura</option>
              <option value="Derecho">derecho</option>
              <option value="Diseño">diseño</option>
              <option value="Humanidades">humanidades</option>
              <option value="Ingeniería">ingeniería</option>
              <option value="Negocios">negocios</option>
              <option value="Salud">salud</option>
            </select><br />

            <label htmlFor="da_inicio_contrato">inicio de contrato *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Fecha de inicio del contrato laboral."><HelpIcon /></span>
            </label><br />
            <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" required/><br />

            <label htmlFor="da_hrs_contrato">horas de contrato:
              <span className="tooltip-icon highlight-icon" data-tooltip="Cantidad de horas."><HelpIcon /></span>
            </label><br />
            <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" required/><br />

            <label htmlFor="da_unidad">unidad académica de adscripción *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Departamento o unidad académica donde está adscrito."><HelpIcon /></span>
            </label><br />
            <select name="da_unidad" id="da_unidad" required>
              <option value="">selecciona una opción</option>
              <option value="Ingeniería arquitectónica">ingeniería arquitectónica</option>
              <option value="Derecho">derecho</option>
              <option value="Relaciones internacionales y alianzas estratégicas">relaciones internacionales y alianzas estratégicas</option>
              <option value="Cultura física y entrenamiento deportivo">cultura física y entrenamiento deportivo</option>
              <option value="Bioconstrucción y diseño sustentable">bioconstrucción y diseño sustentable</option>
              <option value="Diseño interactivo">diseño interactivo</option>
              <option value="Diseño de moda">diseño de moda</option>
              <option value="Diseño e innovación">diseño e innovación</option>
              <option value="Comunicación">comunicación</option>
              <option value="Lengua y literatura modernas">lengua y literatura modernas</option>
              <option value="Producción musical">producción musical</option>
              <option value="Ingeniería automotriz">ingeniería automotriz</option>
              <option value="Ingeniería biomédica">ingeniería biomédica</option>
              <option value="Ingeniería industrial logística">ingeniería industrial logística</option>
              <option value="Ingeniería mecatrónica">ingeniería mecatrónica</option>
              <option value="Ingeniería en desarrollo de tecnología y software">ingeniería en desarrollo de tecnología y software</option>
              <option value="Ingeniería en energía y petróleo">ingeniería en energía y petróleo</option>
              <option value="Administración y dirección financiera">administración y dirección financiera</option>
              <option value="Administración y mercadotecnia estratégica">administración y mercadotecnia estratégica</option>
              <option value="Dirección de empresas y negocios internacionales">dirección de empresas y negocios internacionales</option>
              <option value="Cirujano dentista">cirujano dentista</option>
              <option value="Fisioterapia y rehabilitación">fisioterapia y rehabilitación</option>
              <option value="Nutrición">nutrición</option>
              <option value="Psicología">psicología</option>
            </select><br />

            <label htmlFor="da_campus">campus:
              <span className="tooltip-icon highlight-icon" data-tooltip="Ubicación específica del campus."><HelpIcon /></span>
            </label><br />
            <select name="da_campus" id="da_campus" required>
              <option value="">selecciona una opción</option>
              <option value="Mérida">mérida</option>
              <option value="Valladolid">valladolid</option>
              <option value="Chetumal">chetumal</option>
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
