"use client"

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

async function loadProductionData(pd_id) {
  try {
    const { data } = await axios.get(`/api/client/academicproduction/${pd_id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al cargar los datos de producción.");
  }
}

const formatDateForInput = (isoString) => {
    if (!isoString) return ""; // Si no hay fecha, devolver una cadena vacía
    try {
      const date = new Date(isoString); // Crear un objeto Date
      return date.toISOString().split("T")[0]; // Obtener solo la parte de la fecha en formato "YYYY-MM-DD"
    } catch {
      return ""; // Si ocurre un error, devolver una cadena vacía
    }
};

export default function EditProduction({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState("");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    loadProductionData(id)
      .then((data) => {
        setInfo(data);

        // Configura automáticamente el tipo de producción basado en tp_id
        if (data.tp_id === 1) {
          setSelectedOption("1"); // Artículo
        } else if (data.tp_id === 2) {
          setSelectedOption("2"); // Libro
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  }, [id]);

  const closeModal = () => {
    router.replace(pathname);
  };

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/client/academicproduction/${id}`, info);
      toast.success(response.data.message || "Estudio Actualizados Correctamente.");
      router.refresh();
      router.push('/client/academicproduction');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error Al Actualizar El Estudio.");
    }
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button>
        <br />

        <div className="form">
          <label htmlFor="pd_id">tipo de producción:</label>
          <select name="pd_id" id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} disabled >
            <option value="">selecciona una opción</option>
            <option value="1">artículo</option>
            <option value="2">libro</option>
          </select>
          <br />

          <form onSubmit={handleSubmit} method="post">
            {/* Campos específicos para Articulos */}
            {selectedOption === "1" && (
              <>
                <label htmlFor="art_autores">autor(es):</label><br />
                <input type="text" name="art_autores" id="art_autores" onChange={handleChange} value={info.art_autores} required/><br />

                <label htmlFor="art_estado_actual">estado actual:</label><br />
                <input type="text" name="art_estado_actual" id="art_estado_actual" onChange={handleChange} value={info.art_estado_actual} required/><br />

                <label htmlFor="art_de_la_pagina">de la página:</label><br />
                <input type="number" name="art_de_la_pagina" id="art_de_la_pagina" onChange={handleChange} value={info.art_de_la_pagina} required/><br />

                <label htmlFor="art_a_la_pagina">a la página:</label><br />
                <input type="number" name="art_a_la_pagina" id="art_a_la_pagina" onChange={handleChange} value={info.art_a_la_pagina} required/><br />

                <label htmlFor="art_pais">país:</label><br />
                <input type="text" name="art_pais" id="art_pais" onChange={handleChange} value={info.art_pais} required/><br />

                <label htmlFor="art_volumen">volumen:</label><br />
                <input type="number" name="art_volumen" id="art_volumen" onChange={handleChange} value={info.art_volumen} required/><br />

                <label htmlFor="art_fecha_publicacion">fecha de publicación:</label><br />
                <input type="date" name="art_fecha_publicacion" id="art_fecha_publicacion" onChange={handleChange} value={formatDateForInput(info.art_fecha_publicacion)} required/><br />

                <label htmlFor="art_tipo_articulo">tipo de artículo:</label><br />
                <select name="art_tipo_articulo" id="art_tipo_articulo" onChange={handleChange} value={info.art_tipo_articulo} required>
                  <option value="">selecciona una opción</option>
                  <option value="artículo de difusión y divulgación">articulo de difusion y divulgacion</option>
                  <option value="artículo de arbitrado">artículo de arbitrado</option>
                  <option value="artículo en revista indexada">artículo en revista indexada</option>
                </select><br />

                <label htmlFor="art_titulo_articulo">título del artículo:</label><br />
                <input type="text" name="art_titulo_articulo" id="art_titulo_articulo" onChange={handleChange} value={info.art_titulo_articulo} required/><br />

                <label htmlFor="art_nombre_revista">nombre de la revista:</label><br />
                <input type="text" name="art_nombre_revista" id="art_nombre_revista" onChange={handleChange} value={info.art_nombre_revista} required/><br />

                <label htmlFor="art_editorial">editorial:</label><br />
                <input type="text" name="art_editorial" id="art_editorial" onChange={handleChange} value={info.art_editorial} required/><br />

                <label htmlFor="art_issn">ISSN:</label><br />
                <input type="text" name="art_issn" id="art_issn" onChange={handleChange} value={info.art_issn} required/><br />

                <label htmlFor="art_direccion_electronica">dirección electrónica del artículo:</label><br />
                <input type="text" name="art_direccion_electronica" id="art_direccion_electronica" onChange={handleChange} value={info.art_direccion_electronica} required/><br />
              </>
            )}

            {/* Campos específicos para Libro */}
            {selectedOption === "2" && (
              <>
                <label htmlFor="lib_autores">autor(es) del libro:</label><br />
                <input type="text" name="lib_autores" id="lib_autores" onChange={handleChange} value={info.lib_autores} required /><br />

                <label htmlFor="lib_estado_actual">estado actual del libro:</label><br />
                <select name="lib_estado_actual" id="lib_estado_actual" onChange={handleChange} value={info.lib_estado_actual} required>
                  <option value="">selecciona una opción</option>
                  <option value="aceptado">aceptado</option>
                  <option value="publicado">publicado</option>
                </select><br />

                <label htmlFor="lib_pagina">páginas (libro):</label><br />
                <input type="number" name="lib_pagina" id="lib_pagina" onChange={handleChange} value={info.lib_pagina} required /><br />

                <label htmlFor="lib_pais">país:</label><br />
                <input type="text" name="lib_pais" id="lib_pais" onChange={handleChange} value={info.lib_pais} required /><br />

                <label htmlFor="lib_edicion">edición:</label><br />
                <input type="number" name="lib_edicion" id="lib_edicion" onChange={handleChange} value={info.lib_edicion} required /><br />

                <label htmlFor="lib_isbn">ISBN:</label><br />
                <input type="text" name="lib_isbn" id="lib_isbn" onChange={handleChange} value={info.lib_isbn} required /><br />

                <label htmlFor="lib_titulo_libro">título de libro:</label><br />
                <input type="text" name="lib_titulo_libro" id="lib_titulo_libro" onChange={handleChange} value={info.lib_titulo_libro} required /><br />

                <label htmlFor="lib_tipo_libro">tipo de libro:</label><br />
                <select name="lib_tipo_libro" id="lib_tipo_libro" onChange={handleChange} value={info.lib_tipo_libro} required>
                  <option value="">selecciona una opción</option>
                  <option value="capítulo de libro">capítulo de libro</option>
                  <option value="libro">libro</option>
                </select><br />

                <label htmlFor="lib_tipo_participacion">tipo de participación (libro):</label><br />
                <input type="text" name="lib_tipo_participacion" id="lib_tipo_participacion" onChange={handleChange} value={info.lib_tipo_participacion} required /><br />

                <label htmlFor="lib_editorial">editorial:</label><br />
                <input type="text" name="lib_editorial" id="lib_editorial" onChange={handleChange} value={info.lib_editorial} required /><br />

                <label htmlFor="lib_tiraje">tiraje:</label><br />
                <input type="number" name="lib_tiraje" id="lib_tiraje" onChange={handleChange} value={info.lib_tiraje} required /><br />

                <label htmlFor="lib_fecha_publicacion">fecha de publicación:</label><br />
                <input type="date" name="lib_fecha_publicacion" id="lib_fecha_publicacion" onChange={handleChange} value={formatDateForInput(info.lib_fecha_publicacion)} required /><br />
              </>
            )}

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
