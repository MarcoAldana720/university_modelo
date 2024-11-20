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
      <td data-titulo="nombre(S):">{usuarios.us_nombres}</td>
      <td data-titulo="apellido paterno:">{usuarios.us_apellido_paterno}</td>
      <td data-titulo="apellido materno:">{usuarios.us_apellido_materno}</td>
      <td data-titulo="género:">{usuarios.gen_descripcion}</td>
      <td data-titulo="cargo:">{usuarios.rol_descripcion}</td>
      <td data-titulo="escuela:">{usuarios.esc_descripcion}</td>
      <td data-titulo="estado:">{usuarios.es_descripcion}</td>
    </tr>
  )
}
