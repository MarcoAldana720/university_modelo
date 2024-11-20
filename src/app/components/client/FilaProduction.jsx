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
      <td data-titulo="titulo:">{usuarios.us_nombres}</td>
      <td data-titulo="año:">{usuarios.gen_descripcion}</td>
      <td data-titulo="tipo de producción:">{usuarios.rol_descripcion}</td>
    </tr>
  )
}
