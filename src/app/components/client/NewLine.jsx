"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import HelpIcon from "../../assets/HelpIcon";

export default function NewLine({show}) {
  const pathname = usePathname();
  const router = useRouter();

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
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar" >
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="li_linea">linea *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tema o área de investigación."><HelpIcon /></span>
            </label><br />
            <input type="text" name="li_linea" id="li_linea" required /><br />

            <label htmlFor="lg_actividad_realiza">actividad que realiza *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de trabajo dentro de la línea de investigación."><HelpIcon /></span>
            </label><br />
            <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" required /><br />

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
