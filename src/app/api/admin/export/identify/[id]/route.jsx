import { NextResponse } from "next/server";
import { conn } from "../../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request, { params }) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Decodificar el token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid token",
          error: err.message,
        },
        { status: 400 }
      );
    }

    // Obtener el `id` del usuario desde los parámetros de la ruta
    const { id } = params; // Asume que estás usando [id] como segmento dinámico de la ruta.

    // Validar si el ID es un número
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid user ID in the URL" },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener la información del usuario seleccionado
    const [results] = await conn.query(
      `
      SELECT
        usuarios.us_id,
        usuarios.us_nombres,
        usuarios.us_apellido_paterno,
        usuarios.us_apellido_materno,
        generos.gen_descripcion AS genero,
        identificacion.iden_curp,
        identificacion.iden_fecha_nacimiento,
        identificacion.iden_nacionalidad,
        identificacion.iden_entidad,
        identificacion.iden_rfc,
        identificacion.iden_estado_civil,
        identificacion.iden_telefono,
        identificacion.iden_email,
        identificacion.iden_email_alternativo,
        identificacion.iden_area_dedicacion,
        identificacion.iden_disciplina_dedicacion
      FROM
        usuarios
      JOIN
        generos ON usuarios.us_gen_id = generos.gen_id
      JOIN
        identificacion ON usuarios.us_id = identificacion.iden_id_profesor
      WHERE
        usuarios.us_id = ?
    `,
      [id]
    );

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      return NextResponse.json(
        { message: "No user found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    // Manejar cualquier error inesperado
    return NextResponse.json(
      {
        message: "Error fetching user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
