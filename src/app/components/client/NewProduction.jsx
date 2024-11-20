"use client"

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import { useState } from 'react';

export default function NewStudies({ show }) {
  const [selectedOption, setSelectedOption] = useState("articulo"); // Estado para opción seleccionada
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    try {
      const res = await axios.post('/api/admin', dataObject);
      toast.success(res.data.message || 'Usuario Registrado Exitosamente');
      router.push("/client/academicproduction");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error Al Registrar Usuario');
    }
  }

  const closeModal = () => {
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <label htmlFor="type">Tipo de Producción:</label>
          <select name="type" id="type" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required >
            <option value="articulo">artículo</option>
            <option value="libro">libro</option>
          </select><br />

          <form onSubmit={handleSubmit} method="post">
            {/* Campos específicos para Articulos */}
            {selectedOption === "articulo" && (
              <>
                <label htmlFor="us_linea">autor(es):</label><br />
                <input type="text" name="us_linea" id="us_linea" required/><br />

                <label htmlFor="us_lgac_hrs">estado actual:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required/><br />

                <label htmlFor="us_actividad">de la pagina:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required/><br />

                <label htmlFor="us_linea">pais:</label><br />
                <input type="text" name="us_linea" id="us_linea" required/><br />

                <label htmlFor="us_lgac_hrs">volumen:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required/><br />

                <label htmlFor="us_actividad">fecha de publicacion:</label><br />
                <input type="date" name="us_actividad" id="us_actividad" required/><br />

                <label htmlFor="us_linea">tipo de articulo:</label><br />
                <select name="us_escuela_adscripcion" id="us_escuela_adscripcion" required>
                  <option value="">selecciona una opción</option>
                  <option value="1">articulo de difusion y divulgacion</option>
                  <option value="2">articulo de arbitrado</option>
                  <option value="3">articulo en revista indexada</option>
                </select><br />

                <label htmlFor="us_lgac_hrs">titulo del articulo:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required/><br />

                <label htmlFor="us_actividad">nombre de la revista:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required/><br />

                <label htmlFor="us_linea">a la pagina:</label><br />
                <input type="text" name="us_linea" id="us_linea" required/><br />

                <label htmlFor="us_lgac_hrs">editorial:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required/><br />

                <label htmlFor="us_actividad">ISSN:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required/><br />

                <label htmlFor="us_lgac_hrs">direccion electronica del articulo:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required/><br />

                {/* ASOCIAR CON LA LINEA DE INVESTIGACION */}
                <label htmlFor="us_actividad">asocia liga:</label><br />
                <select name="us_escuela_adscripcion" id="us_escuela_adscripcion" required>
                  <option value="">selecciona una opción</option>
                  <option value="1">administración</option>
                  <option value="2">aplicaciones</option>
                </select><br />
              </>
            )}

            {/* Campos específicos para Libro */}
            {selectedOption === "libro" && (
              <>
                <label htmlFor="us_linea">autor(es) del libro:</label><br />
                <input type="text" name="us_linea" id="us_linea" required /><br />

                <label htmlFor="us_lgac_hrs">estado actual del libro:</label><br />
                <select name="us_escuela_adscripcion" id="us_escuela_adscripcion" required>
                  <option value="">selecciona una opción</option>
                  <option value="aceptado">aceptado</option>
                  <option value="publicado">publicado</option>
                </select><br />

                <label htmlFor="us_actividad">paginas (libro):</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_linea">pais:</label><br />
                <input type="text" name="us_linea" id="us_linea" required /><br />

                <label htmlFor="us_lgac_hrs">edición:</label><br />
                <input type="text" name="us_lgac_hrs" id="us_lgac_hrs" required /><br />

                <label htmlFor="us_actividad">ISBN:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_actividad">titulo de libro:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_lgac_hrs">tipo de libro:</label><br />
                <select name="us_escuela_adscripcion" id="us_escuela_adscripcion" required>
                  <option value="">selecciona una opción</option>
                  <option value="capitulo de libro">capítulo de libro</option>
                  <option value="libro">libro</option>
                </select><br />

                <label htmlFor="us_actividad">tipo de participación (libro):</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_actividad">editorial:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_actividad">tiraje:</label><br />
                <input type="text" name="us_actividad" id="us_actividad" required /><br />

                <label htmlFor="us_fecha_publicacion">fecha de publicación:</label><br />
                <input type="date" name="us_fecha_publicacion" id="us_fecha_publicacion" required /><br />

                {/* ASOCIAR CON LA LINEA DE INVESTIGACION */}
                <label htmlFor="us_lgac_hrs">asociar liga:</label><br />
                <select name="us_escuela_adscripcion" id="us_escuela_adscripcion" required>
                  <option value="">selecciona una opción</option>
                  <option value="1">administración</option>
                  <option value="2">aplicaciones</option>
                </select><br />
              </>
            )}

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
