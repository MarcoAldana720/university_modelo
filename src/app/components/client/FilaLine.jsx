"use client"

import { useRouter } from "next/navigation";

export default function FilaData({ linea }) {
  const router = useRouter();

  function redireccion(id) {
    router.push("/client/line/" + id);
    router.refresh();
  }

  return (
    <tr key={linea.li_id} onClick={() => redireccion(linea.li_id)}>
      <td data-titulo="linea:">{linea.li_linea}</td>
    </tr>
  );
}
