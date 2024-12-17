"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NewInfo from "./NewInfo";

export default function ListVertical() {
  const [identificacion, setIdentificacion] = useState(null); // Datos del usuario
  const [isEditMode, setIsEditMode] = useState(false); // Estado para determinar si es agregar o modificar
  const searchParams = useSearchParams();
  const isAddingNewInfo = searchParams.get("new") === "1";

  useEffect(() => {
    const fetchVertical = async () => {
      try {
        const { data } = await axios.get("/api/client/identify");

        if (data && Object.keys(data).length > 0) {
          setIdentificacion(data); // Cargar datos correctamente
          setIsEditMode(true); // Cambiar a modo edición
        } else {
          setIdentificacion(null); // No hay datos
          setIsEditMode(false); // Cambiar a modo agregar
        }
      } catch (err) {
        console.error("Error al cargar los datos del usuario:", err);
        setIdentificacion(null); // En caso de error, aseguramos que no haya datos
        setIsEditMode(false); // Cambiar a modo agregar
      }
    };

    fetchVertical();
  }, [isAddingNewInfo]); // Dependencia adicional para verificar cuando se agrega nueva información

  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return ""; // Verifica si la fecha es válida

    // Cambia el formato a dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato deseado
  };

  return (
    <section className="container_clients">
      <div>
        <h1 className="title">identificación del profesor</h1><br />
        {/* <span>datos laborales</span><br /> */}
        <div className="table-container">
          <table className="vertical-table">
            <tbody>
              {identificacion ? (
                <>
                  <tr>
                    <td>Clave Única de Registro de Población (CURP)</td>
                    <td>{identificacion.iden_curp || ""}</td>
                  </tr>
                  <tr>
                    <td>Registro Federal de Contribuyente (RFC)</td>
                    <td>{identificacion.iden_rfc || ""}</td>
                  </tr>
                  <tr>
                    <td>Nombre(s)</td>
                    <td>{identificacion?.us_nombres || ""}</td>
                  </tr>
                  <tr>
                    <td>Primer Apellido</td>
                    <td>{identificacion?.us_apellido_paterno || ""}</td>
                  </tr>
                  <tr>
                    <td>Segundo Apellido</td>
                    <td>{identificacion?.us_apellido_materno || ""}</td>
                  </tr>
                  <tr>
                    <td>Género</td>
                    <td>{identificacion?.genero || ""}</td>
                  </tr>
                  <tr>
                    <td>Fecha de Nacimiento</td>
                    <td>{formatDate(identificacion.iden_fecha_nacimiento)}</td>
                  </tr>
                  <tr>
                    <td>Nacionalidad</td>
                    <td>{identificacion.iden_nacionalidad || ""}</td>
                  </tr>
                  <tr>
                    <td>Entidad de Nacimiento</td>
                    <td>{identificacion.iden_entidad || ""}</td>
                  </tr>
                  <tr>
                    <td>Estado Civil</td>
                    <td>{identificacion.iden_estado_civil || ""}</td>
                  </tr>
                  <tr>
                    <td>Celular</td>
                    <td>{identificacion.iden_telefono || ""}</td>
                  </tr>
                  <tr>
                    <td>Correo Institucional</td>
                    <td>{identificacion.iden_email || ""}</td>
                  </tr>
                  <tr>
                    <td>Correo Adicional</td>
                    <td>{identificacion.iden_email_alternativo || ""}</td>
                  </tr>
                  <tr>
                    <td>Área a la que se dedica</td>
                    <td>{identificacion.iden_area_dedicacion || ""}</td>
                  </tr>
                  <tr>
                    <td>Disciplina a la que se dedica</td>
                    <td>{identificacion.iden_disciplina_dedicacion || ""}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td>Clave Única de Registro de Población (CURP)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Registro Federal de Contribuyente (RFC)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Nombre(s)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Primer Apellido</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Segundo Apellido</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Género</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Fecha de Nacimiento</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Nacionalidad</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Entidad de Nacimiento</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Estado Civil</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Celular</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Correo Institucional</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Correo Adicional</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Área a la que se dedica</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Disciplina a la que se dedica</td>
                    <td></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <br />

        <div className="container_add">
          <Link href="/client/identify?new=1">
            <div className="container_btn">
              <AddUserIcon width={18} />
              <span>{isEditMode ? "Modificar" : "Agregar"}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mostrar modal para agregar o editar */}
      <NewInfo show={isAddingNewInfo} data={identificacion} isEdit={isEditMode} />
    </section>
  );
}
