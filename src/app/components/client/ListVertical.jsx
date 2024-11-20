"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NewInfo from "./NewInfo";

export default function ListVertical() {
  const [userData, setUserData] = useState(null);
  const searchParams = useSearchParams();
  const isAddingNewInfo = searchParams.get("new") === "1";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/client");
        setUserData(response.data);
      } catch (err) {
        console.log("Error al cargar los datos del usuario:", err);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return ""; // Verifica si la fecha es válida

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato: DD/MM/YYYY
  };

  return (
    <section className="container_clients">
      <h1 className="title">Identificación del Profesor</h1><br />
      <div className="table-container">
        <table className="vertical-table">
          <tbody>
            <tr>
              <td>clave única de registro de población (CURP)</td>
              <td>{userData?.iden_curp || ""}</td>
            </tr>
            <tr>
              <td>registro federal de contribuyente (RFC)</td>
              <td>{userData?.iden_rfc || ""}</td>
            </tr>
            <tr>
              <td>nombre(s)</td>
              <td>{userData?.us_nombres || ""}</td>
            </tr>
            <tr>
              <td>primer apellido</td>
              <td>{userData?.us_apellido_paterno || ""}</td>
            </tr>
            <tr>
              <td>segundo apellido</td>
              <td>{userData?.us_apellido_materno || ""}</td>
            </tr>
            <tr>
              <td>género</td>
              <td>{userData?.genero || ""}</td>
            </tr>
            <tr>
              <td>fecha de nacimiento</td>
              <td>{formatDate(userData?.iden_fecha_nacimiento) || ""}</td>
            </tr>
            <tr>
              <td>nacionalidad</td>
              <td>{userData?.iden_nacionalidad || ""}</td>
            </tr>
            <tr>
              <td>entidad de nacimiento</td>
              <td>{userData?.iden_entidad || ""}</td>
            </tr>
            <tr>
              <td>estado civil</td>
              <td>{userData?.iden_estado_civil || ""}</td>
            </tr>
            <tr>
              <td>celular</td>
              <td>{userData?.iden_telefono || ""}</td>
            </tr>
            <tr>
              <td>correo institucional</td>
              <td>{userData?.iden_email || ""}</td>
            </tr>
            <tr>
              <td>correo adicional</td>
              <td>{userData?.iden_email_alternativo || ""}</td>
            </tr>
            <tr>
              <td>área a la que se dedica</td>
              <td>{userData?.iden_area_dedicacion || ""}</td>
            </tr>
            <tr>
              <td>disciplina a la que se dedica</td>
              <td>{userData?.iden_disciplina_dedicacion || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <div className="container_add">
        <Link href="/client/identify?new=1">
          <div className="container_btn">
            <AddUserIcon width={18} />
            <span>Modificar</span>
          </div>
        </Link>
      </div>

      <NewInfo show={isAddingNewInfo} />
    </section>
  );
}
