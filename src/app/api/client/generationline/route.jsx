import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCION PARA OPTENER LA LINEA DE GENERACION DEL USUARIO QUE INICIO SESION
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
    const loggedInUser = decoded.id; // Nombre del usuario que inició sesión

    // Consulta para obtener la línea de generación del usuario autenticado
    const results = await conn.query(`
      SELECT
        linea_generacion.lg_id,
        linea_generacion.lg_actividad_realiza,
        linea.li_linea
      FROM
        usuarios
      LEFT JOIN
        linea_generacion ON usuarios.us_id = linea_generacion.lg_id_profesor
      LEFT JOIN
        linea ON linea_generacion.lg_id_linea = linea.li_id
      WHERE
        usuarios.us_id = ?
    `, [loggedInUser]);

    // console.log(results)

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return NextResponse.json(
        {
          message: 'No generation line records found for the user'
        }, {
          status: 404
        }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}
