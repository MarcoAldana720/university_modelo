import { conn } from "../../../../../libs/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// FUNCION PARA OBTENER INFORMACION DE ESTUDIO DEL USUARIO QUE HA INICIADO SESION
export async function GET(request, { params }) {
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

    // Consultar la base de datos para obtener el estudio y verificar que pertenece al usuario
    const result = await conn.query(`
      SELECT
        estudios.est_id,
        estudios.est_nivel_estudios,
        estudios.est_area_estudio,
        estudios.est_disciplina_estudio,
        estudios.est_institucion_otorgante,
        estudios.est_pais_institucion,
        estudios.est_fecha_obtencion_titulo,
        estudios.est_id_profesor
      FROM
        estudios
      WHERE
        estudios.est_id = ?
    `, [params.id]);

    // Verificar si se encontró el estudio y si pertenece al usuario
    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "Estudio No Encontrado."
        }, {
          status: 404
        }
      );
    }

    const estudio = result[0];

    // Verificar que el estudio pertenece al usuario que hace la solicitud
    if (estudio.est_id_profesor !== userId) {
      return NextResponse.json(
        {
          message: "No Autorizado."
        }, {
          status: 403
        }
      );
    }

    // Devolver los datos del estudio
    return NextResponse.json(estudio);
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

// FUNCTION PARA ELIMINAR EL ESTUDIO QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
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
      DELETE FROM estudios
      WHERE est_id = ? AND est_id_profesor = ?
    `, [params.id, userId]);

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Estudio No Encontrado O No Autorizado."
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

// FUNCTION PARA EDITAR EL ESTUDIO QUE HA SELECCIONADO DEL USUARIO QUE HA INICIADO SESION
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

    // Verificar si el estudio pertenece al usuario autenticado
    const existingData = await conn.query(
      "SELECT est_id_profesor FROM estudios WHERE est_id = ?",
      [params.id]
    );

    if (existingData.length === 0) {
      return NextResponse.json(
        {
          message: "Estudio No Encontrado."
        }, {
          status: 404
        }
      );
    }

    const dato = existingData[0];
    if (dato.est_id_profesor !== userId) {
      return NextResponse.json(
        {
          message: "No Autorizado."
        }, {
          status: 403
        }
      );
    }

    // Actualizar los datos en la base de datos
    const result = await conn.query(
      "UPDATE estudios SET ? WHERE est_id = ?",
      [data, params.id]
    );

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "No Se Pudo Actualizar Del Estudio."
        }, {
          status: 500
        }
      );
    }

    // Obtener los datos actualizados para confirmar
    const updatedData = await conn.query(
      "SELECT * FROM estudios WHERE est_id = ?",
      [params.id]
    );

    return NextResponse.json(
      {
        message: "Estudio Actualizado Correctamente.",
        data: updatedData[0], // Enviar el dato actualizado como confirmación
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