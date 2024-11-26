"use client"

import axios from 'axios';
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

async function loadProductionData(pd_id) {
  try {
    const { data } = await axios.get(`/api/client/academicproduction/${pd_id}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de producción.");
  }
}

export default function FormProduction() {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState("");

  const [info, setInfo] = useState({
    // Artículo
    art_autores: "",
    art_estado_actual: "",
    art_de_la_pagina: "",
    art_a_la_pagina: "",
    art_pais: "",
    art_volumen: "",
    art_fecha_publicacion: "",
    art_tipo_articulo: "",
    art_titulo_articulo: "",
    art_nombre_revista: "",
    art_editorial: "",
    art_issn: "",
    art_direccion_electronica: "",

    // Libro
    lib_autores: "",
    lib_estado_actual: "",
    lib_pagina: "",
    lib_pais: "",
    lib_edicion: "",
    lib_isbn: "",
    lib_titulo_libro: "",
    lib_tipo_libro: "",
    lib_tipo_participacion: "",
    lib_editorial: "",
    lib_tiraje: "",
    lib_fecha_publicacion: ""
  });

  useEffect(() => {
    loadProductionData(id)
      .then((data) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id]);

  return (
    <section className="custom_container">
      <Link href="/client/academicproduction">&lt; regresar</Link><br /><br />
      <div className="form_blocked">
        <label htmlFor="pd_id">Tipo de Producción:</label>
        <select name="pd_id" id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required >
          {/* <option value="">selecciona una opcion</option> */}
          <option value="1">artículo</option>
          <option value="2">libro</option>
        </select><br />
        <form action="" method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              {/* Campos específicos para Articulos */}
              {selectedOption === "1" && (
                <>
                  <label htmlFor="art_autores">autor(es):</label><br />
                  <input type="text" name="art_autores" id="art_autores" value={info.art_autores} disabled /><br />

                  <label htmlFor="art_estado_actual">estado actual:</label><br />
                  <input type="text" name="art_estado_actual" id="art_estado_actual" value={info.art_estado_actual} disabled /><br />

                  <label htmlFor="art_de_la_pagina">de la pagina:</label><br />
                  <input type="number" name="art_de_la_pagina" id="art_de_la_pagina" value={info.art_de_la_pagina} disabled /><br />

                  <label htmlFor="art_a_la_pagina">a la pagina:</label><br />
                  <input type="number" name="art_a_la_pagina" id="art_a_la_pagina" value={info.art_a_la_pagina} disabled /><br />

                  <label htmlFor="art_pais">pais:</label><br />
                  <input type="text" name="art_pais" id="art_pais" value={info.art_pais} disabled /><br />

                  <label htmlFor="art_volumen">volumen:</label><br />
                  <input type="number" name="art_volumen" id="art_volumen" value={info.art_volumen} disabled /><br />

                  <label htmlFor="art_fecha_publicacion">fecha de publicacion:</label><br />
                  <input type="date" name="art_fecha_publicacion" id="art_fecha_publicacion" value={info.art_fecha_publicacion} disabled /><br />
                </>
              )}
              {/* Campos específicos para Libro */}
              {selectedOption === "2" && (
                <>
                  <label htmlFor="lib_autores">autor(es) del libro:</label><br />
                  <input type="text" name="lib_autores" id="lib_autores" value={info.lib_autores} disabled /><br />

                  <label htmlFor="lib_estado_actual">estado actual del libro:</label><br />
                  <select name="lib_estado_actual" id="lib_estado_actual" value={info.lib_estado_actual} disabled>
                    <option value="">selecciona una opción</option>
                    <option value="aceptado">aceptado</option>
                    <option value="publicado">publicado</option>
                  </select><br />

                  <label htmlFor="lib_pagina">paginas (libro):</label><br />
                  <input type="number" name="lib_pagina" id="lib_pagina" value={info.lib_pagina} disabled /><br />

                  <label htmlFor="lib_edicion">edición:</label><br />
                  <input type="number" name="lib_edicion" id="lib_edicion" value={info.lib_edicion} disabled /><br />

                  <label htmlFor="lib_isbn">ISBN:</label><br />
                  <input type="text" name="lib_isbn" id="lib_isbn" value={info.lib_isbn} disabled /><br />

                  <label htmlFor="lib_titulo_libro">titulo de libro:</label><br />
                  <input type="text" name="lib_titulo_libro" id="lib_titulo_libro" value={info.lib_titulo_libro} disabled /><br />

                  <label htmlFor="lib_fecha_publicacion">fecha de publicación:</label><br />
                  <input type="date" name="lib_fecha_publicacion" id="lib_fecha_publicacion" value={info.lib_fecha_publicacion} disabled /><br />
                </>
              )}
            </div>

            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
              {/* Campos específicos para Articulos */}
              {selectedOption === "1" && (
                <>
                  <label htmlFor="art_tipo_articulo">tipo de articulo:</label><br />
                  <select name="art_tipo_articulo" id="art_tipo_articulo" value={info.art_tipo_articulo} disabled >
                    <option value="">selecciona una opción</option>
                    <option value="articulo de difusion y divulgacion">articulo de difusion y divulgacion</option>
                    <option value="articulo de arbitrado">articulo de arbitrado</option>
                    <option value="articulo en revista indexada">articulo en revista indexada</option>
                  </select><br />

                  <label htmlFor="art_titulo_articulo">titulo del articulo:</label><br />
                  <input type="text" name="art_titulo_articulo" id="art_titulo_articulo" value={info.art_titulo_articulo} disabled /><br />

                  <label htmlFor="art_nombre_revista">nombre de la revista:</label><br />
                  <input type="text" name="art_nombre_revista" id="art_nombre_revista" value={info.art_nombre_revista} disabled /><br />

                  <label htmlFor="art_editorial">editorial:</label><br />
                  <input type="text" name="art_editorial" id="art_editorial" value={info.art_editorial} disabled /><br />

                  <label htmlFor="art_issn">ISSN:</label><br />
                  <input type="text" name="art_issn" id="art_issn" value={info.art_issn} disabled /><br />

                  <label htmlFor="art_direccion_electronica">direccion electronica del articulo:</label><br />
                  <input type="text" name="art_direccion_electronica" id="art_direccion_electronica" value={info.art_direccion_electronica} disabled /><br />
                </>
              )}

              {/* Campos específicos para Libro */}
              {selectedOption === "2" && (
                <>
                  <label htmlFor="lib_tipo_libro">tipo de libro:</label><br />
                  <select name="lib_tipo_libro" id="lib_tipo_libro" value={info.lib_tipo_libro} disabled >
                    <option value="">selecciona una opción</option>
                    <option value="capitulo de libro">capítulo de libro</option>
                    <option value="libro">libro</option>
                  </select><br />

                  <label htmlFor="lib_tipo_participacion">tipo de participación (libro):</label><br />
                  <input type="text" name="lib_tipo_participacion" id="lib_tipo_participacion" value={info.lib_tipo_participacion} disabled /><br />

                  <label htmlFor="lib_editorial">editorial:</label><br />
                  <input type="text" name="lib_editorial" id="lib_editorial" value={info.lib_editorial} disabled /><br />

                  <label htmlFor="lib_tiraje">tiraje:</label><br />
                  <input type="number" name="lib_tiraje" id="lib_tiraje" value={info.lib_tiraje} disabled /><br />

                  <label htmlFor="lib_pais">pais:</label><br />
                  <input type="text" name="lib_pais" id="lib_pais" value={info.lib_pais} disabled /><br />
                </>
              )}
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <button type="submit">editar</button>
            <button type="submit">eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
