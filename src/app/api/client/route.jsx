import { NextResponse } from "next/server";
import { conn } from "../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

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
        },
        {
          status: 401
        }
      );
    }

    // Decodificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const loggedInUser = decoded.username; // Nombre del usuario que inició sesión

    // Consulta para obtener la información del usuario que inició sesión
    const [results] = await conn.query(`
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
      LEFT JOIN
        identificacion ON usuarios.us_id = identificacion.iden_id_profesor
      WHERE
        usuarios.us_usuario = ?
    `, [loggedInUser]);

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return NextResponse.json(
        {
          message: 'User not found'
        },
        {
          status: 404
        }
      );
    }

    // Retornar los resultados
    return NextResponse.json(results);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}