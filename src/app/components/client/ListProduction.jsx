"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Fila from "./Fila";
import NewUser from "./NewUser";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";

export default function ListProduction() {
    const [usuarios, setUsuarios] = useState([]);
    const searchParams = useSearchParams();
    const isAddingNewUser = searchParams.get("new") === "1";
  
    useEffect(() => {
      async function fetchUsers() {
        const { data } = await axios.get("/api/admin");
        setUsuarios(data);
      }
      fetchUsers();
    }, [isAddingNewUser]);
  
    return (
      <section className="container_clients">
        <h1 className="title">resumen de producción</h1>
        <span className="description">la sección de usuarios ofrece una visión completa de todos los miembros registrados en la plataforma.</span><br /><br />
  
        <div className="container_table">
          <table>
            <thead>
              <tr>
                <th>Nombre(s)</th>
                <th>Apellido(s)</th>
                <th>Género</th>
                <th>Cargo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <Fila usuarios={usuario} key={usuario.us_id} />
              ))}
            </tbody>
          </table>
        </div><br />
  
        <div className="container_add">
          <Link href="/client/identify?new=1">
            <div className="container_btn">
              <AddUserIcon width={18} />
              <span>Agregar</span>
            </div>
          </Link>
        </div>
  
        <NewUser show={isAddingNewUser} />
      </section>
    );
}
