"use client"

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";
import HelpIcon from "../../assets/HelpIcon";

async function loadData(da_id) {
  try {
    const { data } = await axios.get(`/api/client/employmentdata/${da_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de dato laboral.");
  }
}

const formatDateForInput = (isoString) => {
  if (!isoString) return ""; // Si no hay fecha, devolver una cadena vacía
  try {
    const date = new Date(isoString); // Crear un objeto Date
    return date.toISOString().split("T")[0]; // Obtener solo la parte de la fecha en formato "YYYY-MM-DD"
  } catch {
    return ""; // Si ocurre un error, devolver una cadena vacía
  }
};

export default function EditData({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    da_nombramiento: "",
    da_hrs_contrato: "",
    da_escuela_pertenece: "",
    da_inicio_contrato: "",
    da_unidad: "",
    da_campus: "",
  });

  useEffect(() => {
    loadData(id)
      .then((data) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id]);

  const closeModal = () => {
    router.replace(pathname);
  };

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/client/employmentdata/${id}`, info);
      toast.success(response.data.message || "Datos actualizados correctamente.");
      router.refresh();
      router.push('/client/employmentdata');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al actualizar los datos.");
    }
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button>
        <br />

        <div className="form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="da_nombramiento">nombramiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de contrato o cargo asignado."><HelpIcon /></span>
            </label><br />
            <input type="text" name="da_nombramiento" id="da_nombramiento" onChange={handleChange} value={info.da_nombramiento} required /><br />

            <label htmlFor="da_escuela_pertenece">escuela a la que pertenece:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nombre de la escuela o facultad donde labora."><HelpIcon /></span>
            </label><br />
            <select name="da_escuela_pertenece" id="da_escuela_pertenece" onChange={handleChange} value={info.da_escuela_pertenece} required >
              <option value="">Selecciona una opción</option>
              <option value="Arquitectura">arquitectura</option>
              <option value="Derecho">derecho</option>
              <option value="Diseño">diseño</option>
              <option value="Humanidades">humanidades</option>
              <option value="Ingenieria">ingeniería</option>
              <option value="Negocios">negocios</option>
              <option value="Salud">salud</option>
            </select><br />

            <label htmlFor="da_inicio_contrato">inicio de contrato *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Fecha de inicio del contrato laboral."><HelpIcon /></span>
            </label><br />
            <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" onChange={handleChange} value={formatDateForInput(info.da_inicio_contrato)} required /><br />

            <label htmlFor="da_hrs_contrato">horas de contrato:
              <span className="tooltip-icon highlight-icon" data-tooltip="Cantidad de horas."><HelpIcon /></span>
            </label><br />
            <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" onChange={handleChange} value={info.da_hrs_contrato} required /><br />

            <label htmlFor="da_unidad">unidad académica de adscripción *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Departamento o unidad académica donde está adscrito."><HelpIcon /></span>
            </label><br />
            <select name="da_unidad" id="da_unidad" onChange={handleChange} value={info.da_unidad} required >
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
              <option value="producción musical">producción musical</option>
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
            <select name="da_campus" id="da_campus" onChange={handleChange} value={info.da_campus} required >
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
