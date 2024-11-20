import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCION PARA OBTENER TODAS LAS LINEAS
export async function GET() {
  try {
    // Consulta para obtener solo las líneas
    const rows = await conn.query(`
      SELECT
        li_linea
      FROM
        linea
      ORDER BY
        li_linea ASC
    `);

    // Verificar si hay resultados
    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "No lines found",
          data: []
        }, {
          status: 404
        }
      );
    }

    // Devolver solo las líneas
    return NextResponse.json(
      {
        message: "Lines retrieved successfully",
        data: rows
      }
    );
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

// FUNCION PARA AGREGAR UNA NUEVA LINEA
export async function POST(req) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        {
          message: 'No Token Provided'
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token JWT para obtener el ID del usuario
    const decoded = jwt.verify(token, JWT_SECRET);

    const lg_id_profesor = decoded.id; // Asegúrate de que el token contenga el `id`

    // Obtener los datos del cuerpo de la solicitud
    const { li_linea, lg_actividad_realiza } = await req.json();

    // Validación de datos
    if (!li_linea || !lg_actividad_realiza) {
      return NextResponse.json(
        {
          message: 'Falta Campos Obligatorios.'
        }, {
          status: 400
        }
      );
    }

    // Verificar si `li_linea` ya existe en la tabla
    const [existingLine] = await conn.query(
      `SELECT li_linea FROM linea WHERE li_linea = ?`,
      [li_linea]
    );

    if (existingLine) {
      return NextResponse.json(
        {
          message: `La Linea Ya Existe.`
        }, {
          status: 409 // Código de estado para conflicto
        }
      );
    }

    // Inserción en la tabla `linea`
    const resultLinea = await conn.query(
      `INSERT INTO linea (li_linea) VALUES (?)`,
      [li_linea]
    );

    // Obtener el ID de la línea recién creada
    const newLineaId = resultLinea.insertId;

    // Inserción en la tabla `linea_generacion`
    const resultLineaGeneracion = await conn.query(
      `
      INSERT INTO linea_generacion (lg_id_linea, lg_actividad_realiza, lg_id_profesor)
      VALUES (?, ?, ?)
      `,
      [newLineaId, lg_actividad_realiza, lg_id_profesor]
    );

    // Verificar si ambas inserciones fueron exitosas
    if (resultLineaGeneracion?.affectedRows === 1) {
      return NextResponse.json(
        {
          message: "Registro De La Linea Y Línea De Generación Agregados Exitosamente."
        }
      );
    } else {
      throw new Error("No Se Pudo Insertar La Línea De Generación.");
    }
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