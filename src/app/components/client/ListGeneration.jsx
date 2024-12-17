"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaGeneration from "./FilaGeneration";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";

export default function ListGeneration() {
  const [generaciones, setGeneraciones] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewGeneration = searchParams.get("new") === "1";

  useEffect(() => {
    async function fetchGeneraciones() {
      try {
        const { data } = await axios.get("/api/client/generationline/");

        // Filtra los generaciones con los nombres correctos de las propiedades
        const filteredData = data.filter((generacion) => {
          return generacion.li_linea && generacion.lg_actividad_realiza;
        });

        // Actualiza el estado con los generaciones filtrados
        setGeneraciones(filteredData);
      } catch (error) {
        console.error("Error fetching estudios:", error);
      }
    }
    fetchGeneraciones();
  }, [isAddingNewGeneration]);

  return (
    <section className="container_clients">
      <div className="container_table_2">
        {generaciones.length > 0 ? (
          <>
            <h1 className="title">resumen de línea generación</h1>
            <span className="description">Para asociarse a una línea, primero deberás seleccionar la fila correspondiente en la tabla haciendo clic en ella y luego haz preciona el boton de asociar...</span><br /><br />

            <table>
              <thead>
                <tr>
                  <th>linea</th>
                  <th>actividad que realiza</th>
                </tr>
              </thead>
              <tbody>
                {generaciones.map((generacion, index) => (
                  <FilaGeneration key={index}  generacion={generacion} />
                ))}
              </tbody>
            </table><br />

            <div className="container_add">
              <Link href="/client/line">
                <div className="container_btn">
                  <AddUserIcon width={18} />
                  <span>agregar</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>presione asociar, para asociarte a una linea.</p><br />
            <div className="container_add_filter">
              <Link href="/client/line">
                <div className="container_btn_filter">
                  {/* <AddUserIcon width={18} /> */}
                  <span>asociar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
