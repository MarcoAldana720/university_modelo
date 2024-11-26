import { NextResponse } from "next/server";
import { conn } from "../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { id } = params;

  const query = `
    SELECT
      pa.pd_id AS producto_id,
      tp.tp_id,
      tp.tp_descripcion AS tipo_produccion,
      pa.pd_id_articulo,
      pa.pd_id_libro,
      a.*,
      l.*
    FROM
      productos_academicos pa
    LEFT JOIN
      tipo_produccion tp ON pa.pd_id_tipo = tp.tp_id
    LEFT JOIN
      articulos a ON pa.pd_id_articulo = a.art_id
    LEFT JOIN
      libros l ON pa.pd_id_libro = l.lib_id
    WHERE
      pa.pd_id = ?
  `;

  const results = await conn.query(query, [id]);

  if (results.length === 0) {
    return NextResponse.json(
      { message: "No records found" },
      { status: 404 }
    );
  }

  return NextResponse.json(results[0]); // Devuelve un solo registro
}

// FUNCTION PARA ELIMINAR LA PRODUCCION QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName");

    if (!token || typeof token.value !== "string") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Buscar la producción académica
    const [produccion] = await conn.query(
      `SELECT pd_id_articulo, pd_id_libro FROM productos_academicos WHERE pd_id = ? AND pd_id_profesor = ?`,
      [params.id, userId]
    );

    if (!produccion) {
      return NextResponse.json({ message: "Producción académica no encontrada." }, { status: 404 });
    }

    // Eliminar referencias en `productos_academicos`
    if (produccion.pd_id_articulo) {
      await conn.query(`DELETE FROM productos_academicos WHERE pd_id_articulo = ?`, [produccion.pd_id_articulo]);
      await conn.query(`DELETE FROM articulos WHERE art_id = ?`, [produccion.pd_id_articulo]);
    }

    if (produccion.pd_id_libro) {
      await conn.query(`DELETE FROM productos_academicos WHERE pd_id_libro = ?`, [produccion.pd_id_libro]);
      await conn.query(`DELETE FROM libros WHERE lib_id = ?`, [produccion.pd_id_libro]);
    }

    // Confirmar eliminación exitosa
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      {
        message: "Error en la operación de eliminación.",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}

// FUNCTION PARA EDITAR LA PRODUCCION QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
export async function PUT(request, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName");

    if (!token || typeof token.value !== "string") {
      return NextResponse.json({ message: "No autorizado." }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    const userId = decoded.id;

    const { id } = params;
    const body = await request.json();

    // Obtener el tipo de producto y referencias relacionadas
    const [produccion] = await conn.query(
      `
      SELECT
        pd_id_articulo,
        pd_id_libro
      FROM
        productos_academicos
      WHERE
        pd_id = ? AND pd_id_profesor = ?
      `,
      [id, userId]
    );

    if (!produccion) {
      return NextResponse.json(
        { message: "Producción académica no encontrada o no autorizada." },
        { status: 404 }
      );
    }

    if (produccion.pd_id_articulo) {
      // Editar información en la tabla `articulos`
      const { art_autores, art_estado_actual, art_de_la_pagina, art_a_la_pagina, art_pais, art_volumen, art_fecha_publicacion, art_tipo_articulo, art_titulo_articulo, art_nombre_revista, art_editorial, art_issn, art_direccion_electronica } = body;
      await conn.query(
        `
        UPDATE articulos
        SET
          art_autores = ?,
          art_estado_actual = ?,
          art_de_la_pagina = ?,
          art_a_la_pagina = ?,
          art_pais = ?,
          art_volumen = ?,
          art_fecha_publicacion = ?,
          art_tipo_articulo = ?,
          art_titulo_articulo = ?,
          art_nombre_revista = ?,
          art_editorial = ?,
          art_issn = ?,
          art_direccion_electronica = ?
        WHERE
          art_id = ?
        `,
        [art_autores, art_estado_actual, art_de_la_pagina, art_a_la_pagina, art_pais, art_volumen, art_fecha_publicacion, art_tipo_articulo, art_titulo_articulo, art_nombre_revista, art_editorial, art_issn, art_direccion_electronica, produccion.pd_id_articulo]
      );
    }

    if (produccion.pd_id_libro) {
      // Editar información en la tabla `libros`
      const { lib_autores, lib_estado_actual, lib_pagina, lib_pais, lib_edicion, lib_isbn, lib_titulo_libro, lib_tipo_libro, lib_tipo_participacion, lib_editorial, lib_tiraje, lib_fecha_publicacion } = body;
      await conn.query(
        `
        UPDATE libros
        SET
          lib_autores = ?,
          lib_estado_actual = ?,
          lib_pagina = ?,
          lib_pais = ?,
          lib_edicion = ?,
          lib_isbn = ?,
          lib_titulo_libro = ?,
          lib_tipo_libro = ?,
          lib_tipo_participacion = ?,
          lib_editorial = ?,
          lib_tiraje = ?,
          lib_fecha_publicacion = ?
        WHERE
          lib_id = ?
        `,
        [lib_autores, lib_estado_actual, lib_pagina, lib_pais, lib_edicion, lib_isbn, lib_titulo_libro, lib_tipo_libro, lib_tipo_participacion, lib_editorial, lib_tiraje, lib_fecha_publicacion, produccion.pd_id_libro]
      );
    }

    return NextResponse.json({ message: "Información actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar la información:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar la información.",
        detalle: error.message,
      },
      { status: 500 }
    );
  }
}