import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    // Verificar si el token existe
    if (!token) {
      console.log("No se proporcionó un token en las cookies.");
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
      console.error("Error al verificar el token:", err.message);
      return NextResponse.json(
        {
          message: "Invalid token",
          error: err.message,
        },
        { status: 400 }
      );
    }

    const loggedInUser = decoded.id; // Nombre del usuario que inició sesión

    // Consulta para obtener la información del usuario que inició sesión
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
      [loggedInUser]
    );

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error inesperado:", error);
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

// HACIENDO PRUEBAS PARA PODER AGREGAR
export async function POST(req) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "No Autorizado."
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Token Inválido.",
          error: err.message
        }, {
          status: 400
        }
      );
    }

    const userId = decoded.id; // ID del usuario autenticado

    // Leer el body de la solicitud
    const data = await req.json();

    // Insertar información en la base de datos
    await conn.query(
      `
      INSERT INTO identificacion (
        iden_curp, iden_rfc, iden_fecha_nacimiento,
        iden_nacionalidad, iden_entidad, iden_estado_civil, iden_telefono,
        iden_email, iden_email_alternativo, iden_area_dedicacion, iden_disciplina_dedicacion, iden_id_profesor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.iden_curp,
        data.iden_rfc,
        data.iden_fecha_nacimiento,
        data.iden_nacionalidad,
        data.iden_entidad,
        data.iden_estado_civil,
        data.iden_telefono,
        data.iden_email,
        data.iden_email_alternativo,
        data.iden_area_dedicacion,
        data.iden_disciplina_dedicacion,
        userId,
      ]
    );

    return NextResponse.json(
      {
        message: "Información Agregada Con Éxito."
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error Al Agregar Información.", error: error.message
      }, {
        status: 500
      }
    );
  }
}
