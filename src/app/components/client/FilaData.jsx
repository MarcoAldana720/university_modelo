"use client"

import { useRouter } from "next/navigation";

export default function FilaData({ dato }) {
  const router = useRouter();

  function redireccion(id) {
    router.push("/client/employmentdata/" + id);
    router.refresh();
  }

  // Helper function to format the date
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <tr key={dato.da_id} onClick={() => redireccion(dato.da_id)}>
      <td data-titulo="nombramiento:">{dato.da_nombramiento}</td>
      <td data-titulo="horas de contrato:">{dato.da_hrs_contrato}</td>
      <td data-titulo="escuela a la que pertenece:">{dato.da_escuela_pertenece}</td>
      <td data-titulo="inicio de contrato:">{formatDate(dato.da_inicio_contrato)}</td>
    </tr>
  );
}
