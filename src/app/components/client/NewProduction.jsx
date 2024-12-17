"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useState } from "react";
import HelpIcon from "../../assets/HelpIcon";

export default function NewProduction({ show }) {
  const [selectedOption, setSelectedOption] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const dataObject = Object.fromEntries(form);

    // Construcción dinámica del payload
    let payload = {
      tipo_produccion: selectedOption === "1" ? "articulo" : "libro",
      titulo: dataObject[selectedOption === "1" ? "art_titulo_articulo" : "lib_titulo_libro"],
      fecha_publicacion: dataObject[selectedOption === "1" ? "art_fecha_publicacion" : "lib_fecha_publicacion"],
      detalles: {},
    };

    if (selectedOption === "1") {
      payload.detalles = {
        autores: dataObject.art_autores,
        estado_actual: dataObject.art_estado_actual,
        de_la_pagina: dataObject.art_de_la_pagina,
        a_la_pagina: dataObject.art_a_la_pagina,
        pais: dataObject.art_pais,
        volumen: dataObject.art_volumen,
        nombre_revista: dataObject.art_nombre_revista,
        editorial: dataObject.art_editorial,
        issn: dataObject.art_issn,
        direccion_electronica: dataObject.art_direccion_electronica,
        tipo_articulo: dataObject.art_tipo_articulo,
      };
    } else if (selectedOption === "2") {
      payload.detalles = {
        autores: dataObject.lib_autores,
        estado_actual: dataObject.lib_estado_actual,
        pagina: dataObject.lib_pagina,
        pais: dataObject.lib_pais,
        edicion: dataObject.lib_edicion,
        isbn: dataObject.lib_isbn,
        editorial: dataObject.lib_editorial,
        tiraje: dataObject.lib_tiraje || null,
        tipo_participacion: dataObject.lib_tipo_participacion,
        tipo_libro: dataObject.lib_tipo_libro,
      };
    }

    try {
      const res = await axios.post("/api/client/academicproduction", payload);
      toast.success(res.data.message || "Datos Guardados Exitosamente.");
      router.push("/client/academicproduction");
    } catch (error) {
      const errorMsg = error.response?.data.message || "Error Al Guardar Los Datos.";
      toast.error(errorMsg);
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
        </button>
        <br />

        <div className="form">
          <label htmlFor="pd_id">tipo de producción *:
            <span className="tooltip-icon highlight-icon" data-tooltip="Clasifica el tipo de producción."><HelpIcon /></span>
          </label>
          <select name="pd_id" id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required >
            <option value="">selecciona una opción</option>
            <option value="1">artículo</option>
            <option value="2">libro</option>
          </select>
          <br />

          <form onSubmit={handleSubmit} method="post">
            {/* Campos específicos para Articulos */}
            {selectedOption === "1" && (
              <>
                <label htmlFor="art_autores">autor(es) *:</label><br />
                <input type="text" name="art_autores" id="art_autores" required /><br />

                <label htmlFor="art_estado_actual">estado actual *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Situación actual del artículo (aceptado o publicado)."><HelpIcon /></span>
                </label><br />
                <input type="text" name="art_estado_actual" id="art_estado_actual" required /><br />

                <label htmlFor="art_de_la_pagina">de la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" name="art_de_la_pagina" id="art_de_la_pagina" required /><br />

                <label htmlFor="art_a_la_pagina">a la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" name="art_a_la_pagina" id="art_a_la_pagina" required /><br />

                <label htmlFor="art_pais">país *:</label><br />
                <input type="text" name="art_pais" id="art_pais" required /><br />

                <label htmlFor="art_volumen">volumen *:</label><br />
                <input type="number" name="art_volumen" id="art_volumen" required /><br />

                <label htmlFor="art_fecha_publicacion">fecha de publicación *:</label><br />
                <input type="date" name="art_fecha_publicacion" id="art_fecha_publicacion" required /><br />

                <label htmlFor="art_tipo_articulo">tipo de artículo *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del artículo."><HelpIcon /></span>
                </label><br />
                <select name="art_tipo_articulo" id="art_tipo_articulo" required >
                  <option value="">selecciona una opción</option>
                  <option value="Artículo de difusión y divulgación">artículo de difusión y divulgación</option>
                  <option value="Artículo de arbitrado">artículo de arbitrado</option>
                  <option value="Artículo en revista indexada">artículo en revista indexada</option>
                </select><br />

                <label htmlFor="art_titulo_articulo">título del artículo *:</label><br />
                <input type="text" name="art_titulo_articulo" id="art_titulo_articulo" required /><br />

                <label htmlFor="art_nombre_revista">nombre de la revista *:</label><br />
                <input type="text" name="art_nombre_revista" id="art_nombre_revista" required /><br />

                <label htmlFor="art_editorial">editorial *:</label><br />
                <input type="text" name="art_editorial" id="art_editorial" required /><br />

                <label htmlFor="art_issn">ISSN *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Código que identifica publicaciones seriadas."><HelpIcon /></span>
                </label><br />
                <input type="text" name="art_issn" id="art_issn" required /><br />

                <label htmlFor="art_direccion_electronica">dirección electrónica del artículo:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Enlace electrónico para consultar el artículo."><HelpIcon /></span>
                </label><br />
                <input type="text" name="art_direccion_electronica" id="art_direccion_electronica" required/><br />
              </>
            )}

            {/* Campos específicos para Libro */}
            {selectedOption === "2" && (
              <>
                <label htmlFor="lib_autores">autor(es) del libro *:</label><br />
                <input type="text" name="lib_autores" id="lib_autores" required /><br />

                <label htmlFor="lib_estado_actual">estado actual del libro *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Situación del libro (aceptado o publicado)."><HelpIcon /></span>
                </label><br />
                <select name="lib_estado_actual" id="lib_estado_actual" required >
                  <option value="">selecciona una opción</option>
                  <option value="Aceptado">aceptado</option>
                  <option value="Publicado">publicado</option>
                </select><br />

                <label htmlFor="lib_pagina">páginas *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Número total de páginas del libro."><HelpIcon /></span>
                </label><br />
                <input type="number" name="lib_pagina" id="lib_pagina" required /><br />

                <label htmlFor="lib_pais">país *:</label><br />
                <input type="text" name="lib_pais" id="lib_pais" required /><br />

                <label htmlFor="lib_edicion">edición *:</label><br />
                <input type="number" name="lib_edicion" id="lib_edicion" required /><br />

                <label htmlFor="lib_isbn">ISBN:</label><br />
                <input type="text" name="lib_isbn" id="lib_isbn" required /><br />

                <label htmlFor="lib_titulo_libro">título de libro *:</label><br />
                <input type="text" name="lib_titulo_libro" id="lib_titulo_libro" required /><br />

                <label htmlFor="lib_tipo_libro">tipo de libro *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del libro."><HelpIcon /></span>
                </label><br />
                <select name="lib_tipo_libro" id="lib_tipo_libro" required >
                  <option value="">selecciona una opción</option>
                  <option value="Capítulo de libro">capítulo de libro</option>
                  <option value="Libro">libro</option>
                </select><br />

                <label htmlFor="lib_tipo_participacion">tipo de participación (libro):
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rol del profesor en el libro."><HelpIcon /></span>
                </label><br />
                <input type="text" name="lib_tipo_participacion" id="lib_tipo_participacion" required /><br />

                <label htmlFor="lib_editorial">editorial *:</label><br />
                <input type="text" name="lib_editorial" id="lib_editorial" required /><br />

                <label htmlFor="lib_tiraje">tiraje *:</label><br />
                <input type="number" name="lib_tiraje" id="lib_tiraje" required /><br />

                <label htmlFor="lib_fecha_publicacion">fecha de publicación *:</label><br />
                <input type="date" name="lib_fecha_publicacion" id="lib_fecha_publicacion" required /><br />
              </>
            )}

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
