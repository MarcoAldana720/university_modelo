"use client"

import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function AssociateLine({ show }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();  // Para obtener parámetros de la URL
  const lineId = searchParams.get("editLine");  // Aquí obtienes el id de la línea

  const [linea, setLinea] = useState(null);

  // Función para obtener los detalles de la línea
  useEffect(() => {
    if (lineId) {
      axios.get(`/api/client/line/${lineId}`)
        .then(res => setLinea(res.data))
        .catch(error => toast.error('Error al obtener la línea'));
    }
  }, [lineId]);

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    try {
      const res = await axios.post('/api/client/line', {
        li_linea: dataObject.li_linea,
        lg_actividad_realiza: dataObject.lg_actividad_realiza,
      });

      toast.success(res.data.message || 'Registro de estudios agregado exitosamente');
      router.push("/client/line");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al agregar el registro de estudios');
    }
  }

  const closeModal = () => {
    // Aquí puedes manejar la lógica para cerrar el modal
    router.replace(pathname);
  };

  return (
    <div>
      <Modal show={show} pathRedirect={pathname}>
        <div className="container_relative">
          {/* Botón de cerrar */}
          <button onClick={closeModal} className="close-modal" aria-label="Cerrar" >
            &times;
          </button><br />

          <div className="form">
            {/* Mostrar la información de la línea seleccionada */}
            <form onSubmit={handleSubmit} method="post">
              <label htmlFor="li_linea">Linea:</label><br />
              <input type="text" name="li_linea" id="li_linea" defaultValue={linea?.li_linea} required /><br />
              {/* Mostrar el valor de la línea como texto no editable */}
              {/* <label>linea:</label><br />
              <span id="li_linea">{linea?.li_linea}</span><br /> */}

              <label htmlFor="lg_actividad_realiza">actividad que realiza:</label><br />
              <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" defaultValue={linea?.lg_actividad_realiza} required /><br />

              <div className="btn">
                <button type="submit">asociar a mi producción</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
