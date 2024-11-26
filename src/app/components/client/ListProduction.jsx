"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaProduction from "./FilaProduction";
import NewProduction from "./NewProduction";
import NewProductionFilter from "./NewProductionFilter";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";

export default function ListProduction() {
  const [producciones, setProducciones] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewProduction = searchParams.get("new") === "1";

  useEffect(() => {
    async function fetchProducciones() {
      try {
        const response = await axios.get("/api/client/academicproduction");
        setProducciones(response.data); // Actualiza el estado con los datos.
      } catch (error) {
        console.error("Error al obtener las producciones:", error.message);
      }
    }
    fetchProducciones();
  }, [isAddingNewProduction]);

  return (
    <section className="container_clients">
      <div className="container_table">
        {producciones.length > 0 ? (
          <>
          <h1 className="title">resumen de producción</h1>
          <span className="description">la sección de usuarios ofrece una visión completa de todos los miembros registrados en la plataforma.</span><br /><br />
          <table>
            <thead>
              <tr>
                <th>titulo</th>
                <th>año</th>
                <th>tipo de producción</th>
              </tr>
            </thead>
            <tbody>
              {producciones.map((produccion, index) => (
                <FilaProduction key={index} producciones={produccion} />
              ))}
            </tbody>
          </table>

          <div className="container_add">
            <Link href="/client/academicproduction?new=1">
              <div className="container_btn">
                <AddUserIcon width={18} />
                <span>Agregar</span>
              </div>
            </Link>
          </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>presione agregar, para agregar una nuevo producción.</p><br />
            <div className="container_add_filter">
              <Link href="/client/academicproduction?new=1">
                <div className="container_btn_filter">
                  {/* <AddUserIcon width={18} /> */}
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div><br />

      <NewProductionFilter show={isAddingNewProduction}/>
      <NewProduction show={isAddingNewProduction} />
    </section>
  );
}
