"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaProduction from "./FilaProduction";
import NewProduction from "./NewProduction";
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
      <h1 className="title">resumen de producción</h1>
      <span className="description">la sección de usuarios ofrece una visión completa de todos los miembros registrados en la plataforma.</span><br /><br />

      <div className="container_table">
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
      </div><br />

      <div className="container_add">
        <Link href="/client/academicproduction?new=1">
          <div className="container_btn">
            <AddUserIcon width={18} />
            <span>Agregar</span>
          </div>
        </Link>
      </div>

      <NewProduction show={isAddingNewProduction} />
    </section>
  );
}
