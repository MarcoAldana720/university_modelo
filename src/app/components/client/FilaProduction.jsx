"use client"

import { useRouter } from "next/navigation";

export default function FilaProduction({ producciones }) {
  const router = useRouter();

  // console.log(producciones);

  function redireccion(id) {
    router.push("/client/academicproduction/" + id);
    router.refresh();
  }

  // Helper function to format the date
  const formatDate = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    if (isNaN(date)) return ""; // Checks if the date is valid

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
  };

  return (
    <tr key={producciones.id_produccion} onClick={() => redireccion(producciones.id_produccion)}>
      <td data-titulo="titulo:">{producciones.titulo}</td>
      <td data-titulo="año:">{formatDate(producciones.fecha_publicacion)}</td>
      <td data-titulo="tipo de producción:">{producciones.tipo_produccion}</td>
    </tr>
  )
}
