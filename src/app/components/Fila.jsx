"use client"

import { useRouter } from "next/navigation";

export default function Fila({usuarios}) {
  const router = useRouter();

  function redireccion(id) {
    router.push("/admin/usuarios/" + id);
    router.refresh();
  }

  return (
    <tr key={usuarios.us_id} onClick={() => redireccion(usuarios.us_id)}>
      <td data-titulo="Nombre(S):">{usuarios.us_nombres}</td>
      <td data-titulo="Apellido(S):">{usuarios.us_apellidos}</td>
      <td data-titulo="Género:">{usuarios.gen_descripcion}</td>
      <td data-titulo="Cargo:">{usuarios.rol_descripcion}</td>
      <td data-titulo="Escuela:">{usuarios.esc_descripcion}</td>
      <td data-titulo="Estado:">{usuarios.es_descripcion}</td>
    </tr>
  )
}
