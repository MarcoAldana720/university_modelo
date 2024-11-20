"use client"

import { useRouter } from "next/navigation";

export default function FilaStudies({ estudio }) {
  const router = useRouter();

  function redireccion(id) {
    router.push("/client/studies/" + id);
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
    <tr key={estudio.est_id} onClick={() => redireccion(estudio.est_id)}>
      <td data-titulo="nivel de estudio:">{estudio.est_nivel_estudios}</td>
      <td data-titulo="área:">{estudio.est_area_estudio}</td>
      <td data-titulo="disciplina:">{estudio.est_disciplina_estudio}</td>
      <td data-titulo="fecha de obtención:">{formatDate(estudio.est_fecha_obtencion_titulo)}</td>
    </tr>
  );
}
