import { NextResponse } from "next/server";
import { conn } from "../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    console.log("Iniciando proceso para obtener datos del usuario...");

    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;
    console.log("Token recibido:", token);

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
      console.log("Token decodificado:", decoded);
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

    const loggedInUser = decoded.username; // Nombre del usuario que inició sesión
    console.log("Usuario autenticado:", loggedInUser);
    console.log("Valor de loggedInUser:", loggedInUser);

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
      LEFT JOIN
        generos ON usuarios.us_gen_id = generos.gen_id
      LEFT JOIN
        identificacion ON usuarios.us_id = identificacion.iden_id_profesor
      WHERE
        usuarios.us_usuario = ?
    `,
      [loggedInUser]
    );

    console.log("Resultados de la consulta:", results);

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      console.log("No se encontró al usuario.");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Retornar los resultados
    console.log("Datos del usuario obtenidos con éxito.");
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
