import { conn } from "../../../../../libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

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

// FUNCTION PARA ASOCIAR A UNA LINEA QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
export async function POST(req, { params }) {
  try {
    const { id } = params; // ID de la línea seleccionada
    const { lg_actividad_realiza } = await req.json();

    // Obtener el token del usuario autenticado
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "No autorizado"
        }, {
          status: 401
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = decoded.id; // ID del usuario autenticado

    // Verificar si el usuario ya está asociado a la línea seleccionada
    const results = await conn.query(
      `
        SELECT 1
        FROM linea_generacion
        WHERE lg_id_linea = ? AND lg_id_profesor = ?
        LIMIT 1
      `,
      [id, loggedInUser]
    );

    // Si ya existe una asociación para este usuario y esta línea, detener la ejecución
    if (results.length > 0) {
      return NextResponse.json(
        {
          message: "Ya Estás Asociado A Esta Línea."
        }, {
          status: 400
        }
      );
    }

    // Insertar la nueva actividad si no hay asociación previa para este usuario y esta línea
    await conn.query(
      `
        INSERT INTO linea_generacion (lg_id_linea, lg_actividad_realiza, lg_id_profesor)
        VALUES (?, ?, ?)
      `,
      [id, lg_actividad_realiza, loggedInUser]
    );

    return NextResponse.json(
      {
        message: "Actividad Asociada Exitosamente."
      }, {
        status: 201
      }
    );
  } catch (error) {
    console.error("Error En El Backend:", error);
    return NextResponse.json(
      {
        message: "Error Al Asociar La Actividad.", error: error.message
      }, {
        status: 500
      }
    );
  }
}