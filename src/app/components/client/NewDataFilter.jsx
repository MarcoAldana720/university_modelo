"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';

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
            <label htmlFor="da_nombramiento">nombramiento:</label><br />
            <input type="text" name="da_nombramiento" id="da_nombramiento" required/><br />

            <label htmlFor="da_escuela_pertenece">escuela a la que pertenece:</label><br />
            <select name="da_escuela_pertenece" id="da_escuela_pertenece" required>
              <option value="">selecciona una opción</option>
              <option value="arquitectura">arquitectura</option>
              <option value="derecho">derecho</option>
              <option value="diseño">diseño</option>
              <option value="humanidades">humanidades</option>
              <option value="ingeniería">ingeniería</option>
              <option value="negocios">negocios</option>
              <option value="salud">salud</option>
            </select><br />

            <label htmlFor="da_inicio_contrato">inicio de contrato:</label><br />
            <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" required/><br />

            <label htmlFor="da_hrs_contrato">horas de contrato:</label><br />
            <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" required/><br />

            <label htmlFor="da_unidad">unidad ácademica de adscripción:</label><br />
            <select name="da_unidad" id="da_unidad" required>
              <option value="">selecciona una opción</option>
              <option value="ingeniería arquitectónica">ingeniería arquitectónica</option>
              <option value="derecho">derecho</option>
              <option value="relaciones internacionales y alianzas estratégicas">relaciones internacionales y alianzas estratégicas</option>
              <option value="cultura física y entrenamiento deportivo">cultura física y entrenamiento deportivo</option>
              <option value="bioconstrucción y diseño sustentable">bioconstrucción y diseño sustentable</option>
              <option value="diseno interactivo">diseño interactivo</option>
              <option value="diseno de moda">diseño de moda</option>
              <option value="diseño e innovación">diseño e innovación</option>
              <option value="comunicación">comunicación</option>
              <option value="lengua y literatura modernas">lengua y literatura Modernas</option>
              <option value="producción musical">producción musical</option>
              <option value="ingeniería automotriz">ingeniería automotriz</option>
              <option value="ingeniería biomédica">ingeniería biomédica</option>
              <option value="ingeniería industrial logística">ingeniería industrial logística</option>
              <option value="ingeniería mecatrónica">ingeniería mecatrónica</option>
              <option value="ingeniería en desarrollo de tecnología y software">ingeniería en desarrollo de tecnología y software</option>
              <option value="ingeniería en energía y petróleo">ingeniería en energía y petróleo</option>
              <option value="administración y dirección financiera">administración y dirección financiera</option>
              <option value="administración y mercadotecnia estratégica">administración y mercadotecnia estratégica</option>
              <option value="dirección de empresas y negocios internacionales">dirección de empresas y negocios internacionales</option>
              <option value="cirujano dentista">cirujano dentista</option>
              <option value="fisioterapia y rehabilitación">fisioterapia y rehabilitación</option>
              <option value="nutrición">nutrición</option>
              <option value="psicología">psicología</option>
            </select><br />

            <label htmlFor="da_campus">campus:</label><br />
            <select name="da_campus" id="da_campus" required>
              <option value="">selecciona una opción</option>
              <option value="mérida">mérida</option>
              <option value="valladolid">valladolid</option>
              <option value="chetumal">chetumal</option>
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
