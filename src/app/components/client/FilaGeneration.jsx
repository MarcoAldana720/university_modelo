"use client"

import { useRouter } from "next/navigation";

export default function Fila({ generacion }) {
  const router = useRouter();

  function redireccion(id) {
    router.push("/client/generationline/" + id);
    router.refresh();
  }

  // console.log(generacion)

  return (
    <tr key={generacion.lg_id} onClick={() => redireccion(generacion.lg_id)}>
      <td data-titulo="linea:">{generacion.li_linea}</td>
      <td data-titulo="actividad que realiza:">{generacion.lg_actividad_realiza}</td>
    </tr>
  )
}
