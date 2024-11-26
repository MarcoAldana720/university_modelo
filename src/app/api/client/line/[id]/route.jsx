import { conn } from "../../../../../libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// FUNCION PARA OBTENER INFORMACION DE LA LINEA DE GENERACIÓN DEL USUARIO QUE HA INICIADO SESION
export async function GET(request, { params }) {
  try {
    // Obtener el token de las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName");

    // Verificar si el token está presente y obtener solo su valor
    if (!token || typeof token.value !== "string") {
      return NextResponse.json(
        {
          message: "No Autorizado, Token Inválido O Ausente.",
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token (solo para validar que es válido, no se usará el userId)
    jwt.verify(token.value, process.env.JWT_SECRET);

    // Consultar la base de datos para obtener la línea y actividad basada en el ID proporcionado en la ruta
    const result = await conn.query(
      `
      SELECT
        linea.li_id,
        linea.li_linea
      FROM
        linea
      WHERE
        linea.li_id = ?
      `,
      [params.id] // Usamos solo el ID proporcionado en la URL
    );

    // Verificar si se encontraron resultados
    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "No Se Encontraron Líneas De Generación O Actividades Con El ID Especificado.",
        }, {
          status: 404
        }
      );
    }

    // Devolver los datos de la línea y actividad
    return NextResponse.json(result[0]); // Devuelve solo el primer resultado
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      }, {
        status: 500
      }
    );
  }
}





// NO FUNCIONA COMO YO ESPERO
// FUNCTION PARA EDITAR LA LINEA DE GENERACIÓN QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Asegúrate de tener el JWT_SECRET correctamente configurado

    const lg_id_profesor = decoded.id; // Obtener el id del profesor desde el token

    // Obtener los datos del cuerpo de la solicitud
    const { li_linea, lg_actividad_realiza } = await req.json();

    // Validación de los datos
    if (!li_linea || !lg_actividad_realiza) {
      return NextResponse.json(
        {
          message: 'Falta Campos Obligatorios.'
        }, {
          status: 400
        }
      );
    }

    // Verificar si la línea existe en la tabla
    const [existingLine] = await conn.query(
      `SELECT li_linea FROM linea WHERE li_linea = ?`,
      [li_linea]
    );

    if (!existingLine) {
      return NextResponse.json(
        {
          message: `La Linea No Existe.`
        }, {
          status: 404 // Código de estado para no encontrado
        }
      );
    }

    // Verificar si ya existe una asignación de actividad a esta línea para el mismo profesor
    const [existingAssociation] = await conn.query(
      `SELECT * FROM linea_generacion WHERE lg_id_linea = ? AND lg_id_profesor = ?`,
      [existingLine.li_linea, lg_id_profesor]
    );

    if (existingAssociation) {
      return NextResponse.json(
        {
          message: `Ya está asociado a esta línea con una actividad.`
        }, {
          status: 409 // Código de estado para conflicto
        }
      );
    }

    // Insertar la asociación de la actividad en la tabla `linea_generacion`
    const resultLineaGeneracion = await conn.query(
      `
      INSERT INTO linea_generacion (lg_id_linea, lg_actividad_realiza, lg_id_profesor)
      VALUES (?, ?, ?)
      `,
      [existingLine.li_linea, lg_actividad_realiza, lg_id_profesor]
    );

    // Verificar si la inserción fue exitosa
    if (resultLineaGeneracion?.affectedRows === 1) {
      return NextResponse.json(
        {
          message: "Asociación de Actividad a Línea Exitosa."
        }
      );
    } else {
      throw new Error("No Se Pudo Asociar La Actividad a La Línea.");
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