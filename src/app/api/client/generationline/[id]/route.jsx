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
        linea_generacion.lg_id,
        linea.li_linea,
        linea_generacion.lg_actividad_realiza
      FROM
        linea
      INNER JOIN linea_generacion ON linea.li_id = linea_generacion.lg_id_linea
      WHERE
        linea_generacion.lg_id = ?
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

// FUNCTION PARA ELIMINAR LA LINEA DE GENERACIÓN QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
export async function DELETE(request, { params }) {
  try {
    // Obtener el token de las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName");

    // Verificar si el token está presente y obtener solo su valor
    if (!token || typeof token.value !== "string") {
      return NextResponse.json(
        {
          message: "No Autorizado, Token Inválido O Ausente."
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token para obtener el id del usuario
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.id; // ID del usuario en el token

    // Ejecutar la consulta para eliminar el estudio por su ID y el ID del usuario
    const result = await conn.query(`
      DELETE FROM linea_generacion
      WHERE lg_id = ? AND lg_id_profesor = ?
    `, [params.id, userId]);

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Linea De Generación No Encontrado O No Autorizado."
        }, {
          status: 404
        }
      );
    }

    // Respuesta de éxito
    return new Response(null, {
      status: 204,
    });
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

// FUNCTION PARA EDITAR LA LINEA DE GENERACIÓN QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
export async function PUT(request, { params }) {
  try {
    // Obtener el token de las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName");

    // Verificar si el token está presente y obtener solo su valor
    if (!token || typeof token.value !== "string") {
      return NextResponse.json(
        {
          message: "No Autorizado, Token Inválido O Ausente."
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token para obtener el id del usuario
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.id; // ID del usuario en el token

    // Obtener los datos enviados en el cuerpo de la solicitud
    const data = await request.json();

    // Filtrar solo el campo que se puede actualizar
    const { lg_actividad_realiza } = data;

    if (!lg_actividad_realiza) {
      return NextResponse.json(
        {
          message: "La Actividad A Realizar Es Obligatoria."
        }, {
          status: 400
        }
      );
    }

    // Verificar si la línea de generación pertenece al usuario autenticado
    const existingData = await conn.query(
      "SELECT lg_id_profesor FROM linea_generacion WHERE lg_id = ?",
      [params.id]
    );

    if (existingData.length === 0) {
      return NextResponse.json(
        {
          message: "Línea de Generación No Encontrada."
        }, {
          status: 404
        }
      );
    }

    const dato = existingData[0];
    if (dato.lg_id_profesor !== userId) {
      return NextResponse.json(
        {
          message: "No Autorizado."
        }, {
          status: 403
        }
      );
    }

    // Actualizar la columna específica en la base de datos
    const result = await conn.query(
      "UPDATE linea_generacion SET lg_actividad_realiza = ? WHERE lg_id = ?",
      [lg_actividad_realiza, params.id]
    );

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "No Se Pudo Actualizar La Línea de Generación."
        }, {
          status: 500
        }
      );
    }

    // Obtener los datos actualizados para confirmar
    const updatedData = await conn.query(
      "SELECT lg_id, lg_actividad_realiza FROM linea_generacion WHERE lg_id = ?",
      [params.id]
    );

    return NextResponse.json(
      {
        message: "Línea de Generación Actualizada Correctamente.",
        data: updatedData[0] // Enviar el dato actualizado como confirmación
      }, {
        status: 200
      }
    );
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
