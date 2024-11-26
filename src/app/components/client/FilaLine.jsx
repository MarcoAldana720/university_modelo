"use client"

import { useRouter } from "next/navigation";

export default function FilaLine({ linea }) {
  const router = useRouter();

  // console.log(linea);

  function redireccion(id) {
    router.push("/client/line?editLine="+ id);
    router.refresh();
  }

  return (
    <tr key={linea.li_id} onClick={() => redireccion(linea.li_id)}>
      <td data-titulo="linea:">{linea.li_linea}</td>
    </tr>
  );
}
