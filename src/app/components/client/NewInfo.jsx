"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import HelpIcon from "../../assets/HelpIcon";

const formatDateForInput = (isoString) => {
  if (!isoString) return ""; // Si no hay fecha, devolver una cadena vacía
  try {
    const date = new Date(isoString); // Crear un objeto Date
    return date.toISOString().split("T")[0]; // Obtener solo la parte de la fecha en formato "YYYY-MM-DD"
  } catch {
    return ""; // Si ocurre un error, devolver una cadena vacía
  }
};

export default function NewInfo({ show, data = null, isEdit = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState({
    iden_curp: "",
    iden_rfc: "",
    iden_fecha_nacimiento: "",
    iden_nacionalidad: "",
    iden_entidad: "",
    iden_estado_civil: "",
    iden_telefono: "",
    iden_email: "",
    iden_email_alternativo: "",
    iden_area_dedicacion: "",
    iden_disciplina_dedicacion: "",
  });

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        iden_curp: data.iden_curp || "",
        iden_rfc: data.iden_rfc || "",
        iden_fecha_nacimiento: data.iden_fecha_nacimiento || "",
        iden_nacionalidad: data.iden_nacionalidad || "",
        iden_entidad: data.iden_entidad || "",
        iden_estado_civil: data.iden_estado_civil || "",
        iden_telefono: data.iden_telefono || "",
        iden_email: data.iden_email || "",
        iden_email_alternativo: data.iden_email_alternativo || "",
        iden_area_dedicacion: data.iden_area_dedicacion || "",
        iden_disciplina_dedicacion: data.iden_disciplina_dedicacion || "",
      });
    } else {
      setFormData({
        iden_curp: "",
        iden_rfc: "",
        iden_fecha_nacimiento: "",
        iden_nacionalidad: "",
        iden_entidad: "",
        iden_estado_civil: "",
        iden_telefono: "",
        iden_email: "",
        iden_email_alternativo: "",
        iden_area_dedicacion: "",
        iden_disciplina_dedicacion: "",
      });
    }
  }, [data, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        const res = await axios.put(`/api/client/identify/${data.id}`, formData);
        toast.success(res.data.message || "Información actualizada correctamente.");
      } else {
        const res = await axios.post("/api/client/identify", formData);
        toast.success(res.data.message || "Información guardada correctamente.");
      }
      router.refresh();
      router.replace(pathname);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar la información.");
    }
  };

  const closeModal = () => {
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="iden_curp">clave única de registro de población (CURP) *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Código alfanumérico único de 18 caracteres."><HelpIcon /></span>
            </label><br />
            <input type="text" name="iden_curp" id="iden_curp" value={formData.iden_curp} onChange={handleChange} maxLength="18" pattern="^[A-Z0-9]*$" required /><br />

            <label htmlFor="iden_rfc">registro federal de contribuyente (RFC) *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Identificador fiscal de 12 caracteres."><HelpIcon /></span>
            </label><br />
            <input type="text" name="iden_rfc" id="iden_rfc" value={formData.iden_rfc} onChange={handleChange} maxLength="12"
            pattern="^[A-Z0-9]*$" required /><br />

            <label htmlFor="iden_fecha_nacimiento">fecha de nacimiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Indica la fecha de nacimiento."><HelpIcon /></span>
            </label><br />
            <input type="date" name="iden_fecha_nacimiento" id="iden_fecha_nacimiento" value={formatDateForInput(formData.iden_fecha_nacimiento)} onChange={handleChange} required /><br />

            <label htmlFor="iden_nacionalidad">nacionalidad *:</label><br />
            <input type="text" name="iden_nacionalidad" id="iden_nacionalidad" value={formData.iden_nacionalidad} onChange={handleChange} required /><br />

            <label htmlFor="iden_entidad">entidad de nacimiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Estado de la República Mexicana donde nació."><HelpIcon /></span>
            </label><br />
            <input type="text" name="iden_entidad" id="iden_entidad" value={formData.iden_entidad} onChange={handleChange} required /><br />

            <label htmlFor="iden_estado_civil">estado civil *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Situación legal de la persona."><HelpIcon /></span>
            </label><br />
            <select name="iden_estado_civil" id="iden_estado_civil" value={formData.iden_estado_civil} onChange={handleChange} required >
              <option value="">Selecciona una opción</option>
              <option value="Casado(a)">casado(a)</option>
              <option value="Soltero(a)">soltero(a)</option>
            </select><br />

            <label htmlFor="iden_telefono">celular:</label><br />
            <input type="tel" name="iden_telefono" id="iden_telefono" value={formData.iden_telefono} maxLength="10" onChange={handleChange} required /><br />

            <label htmlFor="iden_email">correo electrónico *:</label><br />
            <input type="email" name="iden_email" id="iden_email" value={formData.iden_email} onChange={handleChange} required /><br />

            <label htmlFor="iden_email_alternativo">correo electrónico adicional:</label><br />
            <input type="email" name="iden_email_alternativo" id="iden_email_alternativo" value={formData.iden_email_alternativo} onChange={handleChange} required /><br />

            <label htmlFor="iden_area_dedicacion">área a la que se dedica *:</label><br />
            <select name="iden_area_dedicacion" id="iden_area_dedicacion" value={formData.iden_area_dedicacion} onChange={handleChange} required >
              <option value="">selecciona una opción</option>
              <option value="Arquitectura">arquitectura</option>
              <option value="Derecho">derecho</option>
              <option value="Diseño">diseño</option>
              <option value="Humanidades">humanidades</option>
              <option value="Ingeniería">ingeniería</option>
              <option value="Negocios">negocios</option>
              <option value="Salud">salud</option>
            </select><br />

            <label htmlFor="iden_disciplina_dedicacion">disciplina a la que se dedica *:</label><br />
            <select name="iden_disciplina_dedicacion" id="iden_disciplina_dedicacion" value={formData.iden_disciplina_dedicacion} onChange={handleChange} required >
              <option value="">selecciona una opción</option>
              <option value="Arquitectura">arquitectura</option>
              <option value="Ingeniería arquitectónica">ingeniería arquitectónica</option>
              <option value="Derecho">derecho</option>
              <option value="Relaciones internacionales y alianzas estratégicas">relaciones internacionales y alianzas estratégicas</option>
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
              <option value="Cultura física y entrenamiento deportivo">cultura física y entrenamiento deportivo</option>
              <option value="Fisioterapia y rehabilitación">fisioterapia y rehabilitación</option>
              <option value="Nutrición">nutrición</option>
              <option value="Psicología">psicología</option>
            </select><br />

            <div className="btn">
              <button type="submit">{data ? "Actualizar" : "Guardar"}</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
