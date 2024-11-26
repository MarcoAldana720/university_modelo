"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NewInfo from "./NewInfo";

export default function ListVertical() {
  const [identificacion, setIdentificacion] = useState(null); // Ahora inicializado como null para un objeto.
  const searchParams = useSearchParams();
  const isAddingNewInfo = searchParams.get("new") === "1";

  useEffect(() => {
    const fetchVertical = async () => {
      try {
        const { data } = await axios.get("/api/client");

        // Verifica si el dato obtenido es un objeto o un arreglo y maneja apropiadamente
        if (Array.isArray(data) && data.length > 0) {
          setIdentificacion(data[0]); // Solo toma el primer registro
        } else if (typeof data === "object") {
          setIdentificacion(data); // Asigna el objeto directamente
        } else {
          console.error("Estructura de datos inesperada:", data);
        }
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
      }
    };

    fetchVertical();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return ""; // Verifica si la fecha es válida

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato: DD/MM/YYYY
  };

  return (
    <section className="container_clients">
      <div>
        <h1 className="title">Identificación del Profesor</h1><br />
        <div className="table-container">
          <table className="vertical-table">
            <tbody>
              <tr>
                <td>clave única de registro de población (CURP)</td>
                <td>{identificacion?.iden_curp || ""}</td>
              </tr>
              <tr>
                <td>registro federal de contribuyente (RFC)</td>
                <td>{identificacion?.iden_rfc || ""}</td>
              </tr>
              <tr>
                <td>nombre(s)</td>
                <td>{identificacion?.us_nombres || ""}</td>
              </tr>
              <tr>
                <td>primer apellido</td>
                <td>{identificacion?.us_apellido_paterno || ""}</td>
              </tr>
              <tr>
                <td>segundo apellido</td>
                <td>{identificacion?.us_apellido_materno || ""}</td>
              </tr>
              <tr>
                <td>género</td>
                <td>{identificacion?.genero || ""}</td>
              </tr>
              <tr>
                <td>fecha de nacimiento</td>
                <td>{formatDate(identificacion?.iden_fecha_nacimiento)}</td>
              </tr>
              <tr>
                <td>nacionalidad</td>
                <td>{identificacion?.iden_nacionalidad || ""}</td>
              </tr>
              <tr>
                <td>entidad de nacimiento</td>
                <td>{identificacion?.iden_entidad || ""}</td>
              </tr>
              <tr>
                <td>estado civil</td>
                <td>{identificacion?.iden_estado_civil || ""}</td>
              </tr>
              <tr>
                <td>celular</td>
                <td>{identificacion?.iden_telefono || ""}</td>
              </tr>
              <tr>
                <td>correo institucional</td>
                <td>{identificacion?.iden_email || ""}</td>
              </tr>
              <tr>
                <td>correo adicional</td>
                <td>{identificacion?.iden_email_alternativo || ""}</td>
              </tr>
              <tr>
                <td>área a la que se dedica</td>
                <td>{identificacion?.iden_area_dedicacion || ""}</td>
              </tr>
              <tr>
                <td>disciplina a la que se dedica</td>
                <td>{identificacion?.iden_disciplina_dedicacion || ""}</td>
              </tr>
            </tbody>
          </table>
        </div><br />

        <div className="container_add">
          <Link href="/client/identify?new=1">
            <div className="container_btn">
              <AddUserIcon width={18} />
              <span>modificar</span>
            </div>
          </Link>
        </div>
      </div>

      <NewInfo show={isAddingNewInfo} />
    </section>
  );
}
