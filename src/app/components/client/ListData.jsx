"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaData from "./FilaData";
import NewData from "./NewData";
import NewDataFilter from "./NewDataFilter";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";

export default function ListData() {
  const [datos, setDatos] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewData = searchParams.get("new") === "1";

  useEffect(() => {
    async function fetchDatos() {
      try {
        const { data } = await axios.get("/api/client/employmentdata");

        // Filtra los datos con los nombres correctos de las propiedades
        const filteredData = data.filter((dato) => {
          return dato.da_nombramiento && dato.da_hrs_contrato && dato.da_escuela_pertenece && dato.da_inicio_contrato;
        });

        // Actualiza el estado con los datos filtrados
        setDatos(filteredData);
      } catch (error) {
        console.error("Error fetching estudios:", error);
      }
    }
    fetchDatos();
  }, [isAddingNewData]);

  return (
    <section className="container_clients">
      <div className="container_table">
        {datos.length > 0 ? (
          <>
            <h1 className="title">resumen de datos laborales</h1>
            <span className="description">Para editar o eliminar un dato laboral, primero deberás seleccionar la fila correspondiente en la tabla haciendo clic en ella...</span><br /><br />

            <table>
              <thead>
                <tr>
                  <th>nombramiento</th>
                  <th>horas de contrato</th>
                  <th>escuela a la que pertenece</th>
                  <th>inicio de contrato</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((dato, index) => (
                  <FilaData key={index} dato={dato} />
                ))}
              </tbody>
            </table><br />

            <div className="container_add">
              <Link href="/client/employmentdata?new=1">
                <div className="container_btn">
                  <AddUserIcon width={18} />
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>presione agregar, para agregar un nuevo dato laboral.</p><br />
            <div className="container_add_filter">
              <Link href="/client/employmentdata?new=1">
                <div className="container_btn_filter">
                  {/* <AddUserIcon width={18} /> */}
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <NewDataFilter show={isAddingNewData}/>
      <NewData show={isAddingNewData} />
    </section>
  );
}
