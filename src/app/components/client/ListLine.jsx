"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaLine from "./FilaLine";
import NewLine from "./NewLine";
import NewLineFilter from "./NewLineFilter";
import AssociateLine from "./AssociateLine";
import AddUserIcon from "../../assets/AddUserIcon";
import ReturnIcon from "../../assets/ReturnIcon";
import { useSearchParams } from "next/navigation";

export default function ListLine() {
  const [lineas, setLineas] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewLine = searchParams.get("new") === "1";
  const isEditLine = searchParams.get('editLine') ?? false

  useEffect(() => {
    async function fetchLines() {
      try {
        const res = await axios.get("/api/client/line");

        // Acceder al array de líneas dentro de la respuesta
        const filteredData = res.data.data.filter((linea) => {
          return linea.li_linea;
        });

        // Actualiza el estado con las líneas filtradas
        setLineas(filteredData);
      } catch (error) {
        console.error("Error fetching lines:", error);
      }
    }
    fetchLines();
  }, [isAddingNewLine]);

  return (
    <section className="container_clients">
      <div className="container_table_2">
        {lineas.length > 0 ? (
          <>
            <h1 className="title">Resultados de líneas</h1>
            <span className="description">Para asociarse a una línea, primero deberás seleccionar la filacorrespondiente en la tabla haciendo clic en ella y luego haz presión en el botón de asociar...</span><br /><br />

            <table>
              <thead>
                <tr>
                  <th>Línea</th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea, index) => (
                  <FilaLine key={index} linea={linea} />
                ))}
              </tbody>
            </table>
            <br />

            <div className="container_add">
              {/* Nuevo botón Regresar */}
              <Link href="/client/generationline">
                <div className="container_btn_2">
                  <ReturnIcon width={18} />
                  <span>regresar</span>
                </div>
              </Link>

              {/* Botón Agregar */}
              <Link href="/client/line?new=1">
                <div className="container_btn">
                  <AddUserIcon width={18} />
                  <span>agregar</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>Presione agregar para agregar una nueva línea.</p>
            <br />
            <div className="container_add_filter">
              <Link href="/client/line?new=1">
                <div className="container_btn_filter">
                  {/* <AddUserIcon width={18} /> */}
                  <span>agregar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <NewLineFilter show={isAddingNewLine} />
      <NewLine show={isAddingNewLine} />
      <AssociateLine show={isEditLine} />
    </section>
  );
}
