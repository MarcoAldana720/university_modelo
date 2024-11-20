"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

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
            <label htmlFor="da_nombramiento">Nombramiento:</label><br />
            <input type="text" name="da_nombramiento" id="da_nombramiento" onChange={handleChange} value={info.da_nombramiento} required /><br />

            <label htmlFor="da_escuela_pertenece">Escuela a la que pertenece:</label><br />
            <select name="da_escuela_pertenece" id="da_escuela_pertenece" onChange={handleChange} value={info.da_escuela_pertenece} required >
              <option value="">Selecciona una opción</option>
              <option value="arquitectura">arquitectura</option>
              <option value="derecho">derecho</option>
              <option value="diseno">diseño</option>
              <option value="humanidades">humanidades</option>
              <option value="ingenieria">ingeniería</option>
              <option value="negocios">negocios</option>
              <option value="salud">salud</option>
            </select><br />

            <label htmlFor="da_inicio_contrato">Inicio de contrato:</label><br />
            <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" onChange={handleChange} value={formatDateForInput(info.da_inicio_contrato)} required /><br />

            <label htmlFor="da_hrs_contrato">Horas de contrato:</label><br />
            <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" onChange={handleChange} value={info.da_hrs_contrato} required /><br />

            <label htmlFor="da_unidad">Unidad académica de adscripción:</label><br />
            <select name="da_unidad" id="da_unidad" onChange={handleChange} value={info.da_unidad} required >
              <option value="">selecciona una opción</option>
              <option value="ingeniería arquitectónica">ingeniería arquitectónica</option>
              <option value="derecho">derecho</option>
              <option value="relaciones internacionales y alianzas estratégicas">relaciones internacionales y alianzas estratégicas</option>
              <option value="cultura física y entrenamiento deportivo">cultura física y entrenamiento deportivo</option>
              <option value="bioconstrucción y diseño sustentable">bioconstrucción y diseño sustentable</option>
              <option value="diseño interactivo">diseño interactivo</option>
              <option value="diseño de moda">diseño de moda</option>
              <option value="diseño e innovación">diseño e innovación</option>
              <option value="comunicación">comunicación</option>
              <option value="lengua y literatura modernas">lengua y literatura modernas</option>
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

            <label htmlFor="da_campus">Campus:</label><br />
            <select name="da_campus" id="da_campus" onChange={handleChange} value={info.da_campus} required >
              <option value="">Selecciona una opción</option>
              <option value="mérida">Mérida</option>
              <option value="valladolid">Valladolid</option>
              <option value="chetumal">Chetumal</option>
            </select><br />

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
