"use client"

import Link from "next/link";
import AddUserIcon from "../../assets/AddUserIcon";

export default function ListVertical() {
  return (
    <section className="container_clients">
      <h1 className="title">identificación del profesor</h1>
      <span className="description">la sección de usuarios ofrece una visión completa de todos los miembros registrados en la plataforma.</span><br /><br />
      <div className="table-container">
        <table className="vertical-table">
          <tbody>
            <tr>
              <td>Clave Única de Registro de Problación (CURP)</td>
              <td>Juan Pérez</td>
            </tr>
            <tr>
              <td>Registro Federal de Contribuyente (RFC)</td>
              <td>juanperez@example.com</td>
            </tr>
            <tr>
              <td>Nombre(S)</td>
              <td>+123456789</td>
            </tr>
            <tr>
              <td>Primer Apellido</td>
              <td>Calle Falsa 123</td>
            </tr>
            <tr>
              <td>Segundo Apellido</td>
              <td>Juan Pérez</td>
            </tr>
            <tr>
              <td>Sexo</td>
              <td>juanperez@example.com</td>
            </tr>
            <tr>
              <td>Fecha de Nacimiento</td>
              <td>+123456789</td>
            </tr>
            <tr>
              <td>Nacionalidad</td>
              <td>Calle Falsa 123</td>
            </tr>
            <tr>
              <td>Entidad de Nacimiento</td>
              <td>Calle Falsa 123</td>
            </tr>
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
    </section>
  )
}
