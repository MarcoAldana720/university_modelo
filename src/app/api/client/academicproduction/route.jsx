import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCION PARA OBTENER TITULO, FECHA Y TIPO DE PRODUCCION
export async function GET() {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        {
          message: 'No token provided'
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const loggedInUser = decoded.id; // ID del usuario que inició sesión

    // Consulta para obtener el título, fecha de publicación y tipo de producción
    const results = await conn.query(`
      SELECT
        pd_id AS id_produccion,
        tp_descripcion AS tipo_produccion,
        CASE
          WHEN pd_id_articulo IS NOT NULL THEN art_titulo_articulo
          WHEN pd_id_libro IS NOT NULL THEN lib_titulo_libro
        END AS titulo,
        CASE
          WHEN pd_id_articulo IS NOT NULL THEN art_fecha_publicacion
          WHEN pd_id_libro IS NOT NULL THEN lib_fecha_publicacion
        END AS fecha_publicacion
      FROM
        productos_academicos
      LEFT JOIN tipo_produccion ON pd_id_tipo = tp_id
      LEFT JOIN articulos ON pd_id_articulo = art_id
      LEFT JOIN libros ON pd_id_libro = lib_id
      WHERE
        pd_id_profesor = ?
    `, [loggedInUser]);

    // Verificar si se encontraron resultados
    // if (results.length === 0) {
    //   return NextResponse.json(
    //     {
    //       message: 'No articles or books found for the user'
    //     }, {
    //       status: 404
    //     }
    //   );
    // }

    // console.log(results);

    return NextResponse.json(results);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}

// FUNCION PARA INSERTAR UN NUEVO ARTÍCULO O LIBRO DEPENDIENDO DEL TIPO DE PRODUCCIÓN
export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No Se Proporcionó Token.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = decoded.id;

    const { tipo_produccion, titulo, fecha_publicacion, detalles } = await req.json();

    if (!detalles || !detalles.autores || !detalles.estado_actual || !detalles.pais) {
      return NextResponse.json(
        { message: 'Faltan Detalles Requeridos Para La Producción.' },
        { status: 400 }
      );
    }

    let nuevoProductoId;

    if (tipo_produccion === 'articulo') {
      const resultArticulo = await conn.query(
        `
        INSERT INTO articulos (
          art_titulo_articulo,
          art_fecha_publicacion,
          art_tipo_articulo,
          art_autores,
          art_estado_actual,
          art_de_la_pagina,
          art_a_la_pagina,
          art_pais,
          art_volumen,
          art_nombre_revista,
          art_editorial,
          art_issn,
          art_direccion_electronica
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          titulo,
          fecha_publicacion,
          detalles.tipo_articulo || null,
          detalles.autores,
          detalles.estado_actual,
          detalles.de_la_pagina || null,
          detalles.a_la_pagina || null,
          detalles.pais,
          detalles.volumen || null,
          detalles.nombre_revista || null,
          detalles.editorial || null,
          detalles.issn || null,
          detalles.direccion_electronica || null,
        ]
      );

      nuevoProductoId = resultArticulo.insertId;
    } else if (tipo_produccion === 'libro') {
      const resultLibro = await conn.query(
        `
        INSERT INTO libros (
          lib_titulo_libro,
          lib_fecha_publicacion,
          lib_tipo_libro,
          lib_autores,
          lib_estado_actual,
          lib_pagina,
          lib_pais,
          lib_edicion,
          lib_isbn,
          lib_editorial,
          lib_tiraje,
          lib_tipo_participacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          titulo,
          fecha_publicacion,
          detalles.tipo_libro || null,
          detalles.autores,
          detalles.estado_actual,
          detalles.pagina || null,
          detalles.pais,
          detalles.edicion || null,
          detalles.isbn || null,
          detalles.editorial || null,
          detalles.tiraje || null,
          detalles.tipo_participacion || null,
        ]
      );

      nuevoProductoId = resultLibro.insertId;
    } else {
      return NextResponse.json(
        { message: 'Tipo De Producción Inválido.' },
        { status: 400 }
      );
    }

    await conn.query(
      `
      INSERT INTO productos_academicos (pd_id_tipo, pd_id_articulo, pd_id_libro, pd_id_profesor)
      VALUES (?, ?, ?, ?)
    `,
      [
        tipo_produccion === 'articulo' ? 1 : 2,
        tipo_produccion === 'articulo' ? nuevoProductoId : null,
        tipo_produccion === 'libro' ? nuevoProductoId : null,
        loggedInUser,
      ]
    );

    return NextResponse.json({
      message: 'Nuevo Producto Agregado Exitosamente.',
      productId: nuevoProductoId,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
