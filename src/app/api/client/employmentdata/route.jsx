import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCION PARA OPTENER TODOS LOS DATOS QUE HA REALIZADO EL USUARIO QUE INICIO SESION
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
    const loggedInUser = decoded.username; // Nombre del usuario que inició sesión

    // Consulta para obtener toda la información de estudios del usuario autenticado
    const results = await conn.query(`
      SELECT
        datos.da_id,
        datos.da_nombramiento,
        datos.da_hrs_contrato,
        datos.da_escuela_pertenece,
        datos.da_inicio_contrato,
        datos.da_unidad,
        datos.da_campus
      FROM
        usuarios
      LEFT JOIN
        datos ON usuarios.us_id = datos.da_id_profesor
      WHERE
        usuarios.us_usuario = ?
    `, [loggedInUser]);

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return NextResponse.json(
        {
          message: 'No study records found for the user'
        }, {
          status: 404
        }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// FUNCION PARA AGREGAR UN DATO NUEVO QUE HA REALIZADO EL USUARIO QUE INICIO SESION
export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Decodificar el token JWT para obtener el `id`
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded); // Verificar el contenido del token
    const da_id_profesor = decoded.id; // Asegúrate de que esto sea correcto

    // Obtener los datos del cuerpo de la solicitud
    const {
      da_nombramiento,
      da_hrs_contrato,
      da_escuela_pertenece,
      da_inicio_contrato,
      da_unidad,
      da_campus
    } = await req.json();

    // Validación de datos
    if (
      ! da_nombramiento ||
      ! da_hrs_contrato ||
      ! da_escuela_pertenece ||
      ! da_inicio_contrato ||
      ! da_unidad |
      ! da_campus
    ) {
      return NextResponse.json(
        {
          message: 'Missing required fields'
        }, {
          status: 400
        }
      );
    }

    // Inserción de los datos en la base de datos
    const result = await conn.query(
      `
      INSERT INTO datos (
        da_nombramiento,
        da_hrs_contrato,
        da_escuela_pertenece,
        da_inicio_contrato,
        da_unidad,
        da_campus,
        da_id_profesor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        da_nombramiento,
        da_hrs_contrato,
        da_escuela_pertenece,
        da_inicio_contrato,
        da_unidad,
        da_campus,
        da_id_profesor // Asegúrate de que esto contenga el ID correcto
      ]
    );

    console.log("Resultado de la inserción:", result); // Log para verificar el resultado

    if (result?.affectedRows === 1) {
      return NextResponse.json(
        {
          message: "Study record added successfully",
          insertId: result.insertId
        }
      );
    } else {
      throw new Error("Failed to insert study record");
    }

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