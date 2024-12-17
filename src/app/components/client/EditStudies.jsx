"use client"

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";
import HelpIcon from "../../assets/HelpIcon";

async function loadData(est_id) {
  try {
    const { data } = await axios.get(`/api/client/studies/${est_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de estudio.");
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

export default function EditStudies({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    est_nivel_estudios: "",
    est_area_estudio: "",
    est_disciplina_estudio: "",
    est_institucion_otorgante: "",
    est_pais_institucion: "",
    est_fecha_obtencion_titulo: "",
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
      const response = await axios.put(`/api/client/studies/${id}`, info);
      toast.success(response.data.message || "Estudio Actualizados Correctamente.");
      router.refresh();
      router.push('/client/studies');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error Al Actualizar El Estudio.");
    }
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="est_nivel_estudios">nivel de estudios *:
              <span className="tooltip-icon highlight-icon" data-tooltip="nivel académico alcanzado."><HelpIcon /></span>
            </label><br />
            <select name="est_nivel_estudios" id="est_nivel_estudios" onChange={handleChange} value={info.est_nivel_estudios} required >
              <option value="">selecciona una opción</option>
              <option value="Doctorado">doctorado</option>
              <option value="Maestria">maestría</option>
              <option value="Licenciatura">licenciatura</option>
            </select>
            <br />

            <label htmlFor="est_area_estudio">área *:
              <span className="tooltip-icon highlight-icon" data-tooltip="campo de estudio o disciplina principal."><HelpIcon /></span>
            </label><br />
            <select name="est_area_estudio" id="est_area_estudio" onChange={handleChange} value={info.est_area_estudio} required >
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

            <label htmlFor="est_disciplina_estudio">disciplina *:</label><br />
            <input type="text" name="est_disciplina_estudio" id="est_disciplina_estudio" onChange={handleChange} value={info.est_disciplina_estudio} required /> <br />

            <label htmlFor="est_fecha_obtencion_titulo">fecha de obtención del título o grado *:
              <span className="tooltip-icon highlight-icon" data-tooltip="fecha en que se emitió el título o grado."><HelpIcon /></span>
            </label><br />
            <input type="date" name="est_fecha_obtencion_titulo" id="est_fecha_obtencion_titulo" onChange={handleChange} value={formatDateForInput(info.est_fecha_obtencion_titulo)} required /><br />

            <label htmlFor="est_institucion_otorgante">institución otorgante:
              <span className="tooltip-icon highlight-icon" data-tooltip="nombre de la universidad o institución que otorgó el título o grado."><HelpIcon /></span>
            </label><br />
            <input type="text" name="est_institucion_otorgante" id="est_institucion_otorgante" onChange={handleChange} value={info.est_institucion_otorgante} required /><br />

            <label htmlFor="est_pais_institucion">país *:
              <span className="tooltip-icon highlight-icon" data-tooltip="país donde se encuentra la institución que emitió el título."><HelpIcon /></span>
            </label><br />
            <input type="text" name="est_pais_institucion" id="est_pais_institucion" onChange={handleChange} value={info.est_pais_institucion} required /><br />

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
