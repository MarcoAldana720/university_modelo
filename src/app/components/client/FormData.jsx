"use client"

import Link from 'next/link'
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import ButtonEditData from "./ButtonEditData";
import EditData from "./EditData";

// Helper function to load study data
async function loadData(da_id) {
  try {
    const { data } = await axios.get(`/api/client/employmentdata/${da_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de estudio.");
  }
}

// Helper function to format the date to "YYYY-MM-DD"
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormData() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const edit = search.get('edit') ?? ''
  const [info, setInfo] = useState({
    da_nombramiento: "",
    da_hrs_contrato: "",
    da_escuela_pertenece: "",
    da_inicio_contrato: "",
    da_unidad: "",
    da_campus: "",
  });

  // Load study data on component mount
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

  // Handle delete study
  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.delete(`/api/client/employmentdata/${id}`, {
        withCredentials: true,
      });

      if (response.status === 204) {
        toast.success("Dato eliminado exitosamente");
        router.push("/client/employmentdata");
      } else if (response.status === 404) {
        toast.error("Estudio no encontrado");
      } else if (response.status === 401) {
        toast.error("No autorizado");
      } else {
        toast.error("Error al eliminar el estudio");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en el servidor");
    }
  };

  return (
    <section className="custom_container">
      <EditData show={Boolean(edit)} pathname={pathname}/>
      <Link href="/client/employmentdata">&lt; regresar</Link><br /><br />
      <div className="form_blocked">
        <form method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              <label htmlFor="da_nombramiento">nombramiento:</label><br />
              <input type="text" name="da_nombramiento" id="da_nombramiento" value={info.da_nombramiento} disabled /><br />

              <label htmlFor="da_escuela_pertenece">escuela a la que pertenece:</label><br />
              <select name="da_escuela_pertenece" id="da_escuela_pertenece" value={info.da_escuela_pertenece} disabled >
                <option value="">selecciona una opción</option>
                <option value="arquitectura">arquitectura</option>
                <option value="derecho">derecho</option>
                <option value="diseno">diseño</option>
                <option value="humanidades">humanidades</option>
                <option value="ingeniería">ingeniería</option>
                <option value="negocios">negocios</option>
                <option value="salud">salud</option>
              </select><br />

              <label htmlFor="da_inicio_contrato">inicio de contrato:</label><br />
              <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" value={formatDateForInput(info.da_inicio_contrato)} disabled /><br />
            </div>
            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
            <label htmlFor="da_hrs_contrato">horas de contrato:</label><br />
              <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" value={info.da_hrs_contrato} disabled /><br />

              <label htmlFor="da_unidad">unidad ácademica de adscripcion:</label><br />
              <select name="da_unidad" id="da_unidad" value={info.da_unidad} disabled >
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

              <label htmlFor="da_campus">campus:</label><br />
              <select name="da_campus" id="da_campus" value={info.da_campus} disabled >
                <option value="">selecciona una opción</option>
                <option value="mérida">mérida</option>
                <option value="valladolid">valladolid</option>
                <option value="chetumal">chetumal</option>
              </select><br />
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <ButtonEditData />
            <button type="button" onClick={handleDelete}>Eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
