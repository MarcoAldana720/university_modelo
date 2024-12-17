"use client";

import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import HelpIcon from "../../assets/HelpIcon";

export default function AssociateLine({ show }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineId = searchParams.get("editLine"); // Obtén el ID de la línea seleccionada de los parámetros de la URL.

  const [linea, setLinea] = useState(null);

  // Función para obtener los detalles de la línea seleccionada.
  useEffect(() => {
    if (lineId) {
      axios
        .get(`/api/client/line/${lineId}`)
        .then((res) => setLinea(res.data))
        .catch(() => toast.error("Error Al Obtener La Línea Seleccionada."));
    }
  }, [lineId]);

  const closeModal = () => {
    router.replace(pathname); // Cierra el modal al reemplazar la ruta actual.
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    // console.log("lineId enviado:", lineId);
    // console.log("Actividad enviada:", dataObject.lg_actividad_realiza);

    try {
      const res = await axios.post(`/api/client/line/${lineId}`, {
        lg_actividad_realiza: dataObject.lg_actividad_realiza,
      });

      toast.success(res.data.message || "Actividad Asociada Exitosamente.");
      router.push("/client/generationline"); // Redirige al listado de líneas
    } catch (error) {
      console.error("Error Al Asociar La Actividad:", error);
      toast.error(
        error.response?.data.message || "Error Al Asociar La Actividad."
      );
    }
  }

  return (
    <div>
      <Modal show={show} pathRedirect={pathname}>
        <div className="container_relative">
          {/* Botón para cerrar el modal */}
          <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
            &times;
          </button>
          <br />

          <div className="form">
            <form onSubmit={handleSubmit}>
              <label htmlFor="li_linea">línea *:
                <span className="tooltip-icon highlight-icon" data-tooltip="Tema o área de investigación."><HelpIcon /></span>
              </label>
              <input type="text" name="li_linea" id="li_linea" value={linea?.li_linea || ""} disabled /><br />

              <label htmlFor="lg_actividad_realiza">Actividad que realiza *:
                <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de trabajo dentro de la línea de investigación."><HelpIcon /></span>
              </label>
              <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" placeholder="Ingrese la actividad" required /><br />

              <div className="btn">
                <button type="submit">asociar a mi producción</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
