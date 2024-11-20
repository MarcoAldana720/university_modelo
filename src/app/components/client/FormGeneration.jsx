"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import ButtonEditGeneration from "./ButtonEditGeneration";
import EditGeneration from "./EditGeneration";

// Helper function to load study data
async function loadStudyData(lg_id) {
  try {
    const { data } = await axios.get(`/api/client/generationline/${lg_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error Al Cargar Los Datos De Linea De Generación.");
  }
}

export default function FormGenerarion() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname()
  const search = useSearchParams()
  const edit = search.get('edit') ?? ''
  const [info, setInfo] = useState({
    li_linea: "",
    lg_actividad_realiza: "",
  });

  // Load study data on component mount
  useEffect(() => {
    loadStudyData(id)
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
      const response = await axios.delete(`/api/client/generationline/${id}`, {
        withCredentials: true,
      });

      if (response.status === 204) {
        toast.success("Linea De Generación Eliminado Exitosamente.");
        router.push("/client/generationline");
      } else if (response.status === 404) {
        toast.error("Linea De Generación No Encontrado.");
      } else if (response.status === 401) {
        toast.error("No Autorizado.");
      } else {
        toast.error("Error Al Eliminar La Linea De Generación.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error En El Servidor");
    }
  };

  return (
    <section className="custom_container">
      <EditGeneration show={Boolean(edit)} pathname={pathname}/>
      <Link href="/client/generationline">&lt; regresar</Link><br /><br />
      <div className="form_blocked">
        <form action="" method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              <label htmlFor="li_linea">linea:</label><br />
              <input type="text" name="li_linea" id="li_linea" value={info.li_linea} disabled /><br />
            </div>
            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
              <label htmlFor="lg_actividad_realiza">actividad que realiza:</label><br />
              <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" value={info.lg_actividad_realiza} disabled /><br />
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <ButtonEditGeneration />
            <button type="button" onClick={handleDelete}>Eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
