import { conn } from "../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  try {
    const { id } = params; // Obtener el ID desde los parámetros de la URL

    // Verificar la autenticación usando las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET); // Validar el token

    // Consulta para obtener la información del usuario por su ID
    const [results] = await conn.query(
      `
      SELECT
        iden_curp,
        iden_rfc,
        iden_fecha_nacimiento,
        iden_nacionalidad,
        iden_entidad,
        iden_estado_civil,
        iden_telefono,
        iden_email,
        iden_email_alternativo,
        iden_area_dedicacion,
        iden_disciplina_dedicacion
      FROM identificacion
      WHERE iden_id_profesor = ?
    `,
      [id]
    );

    // Verificar si se encontró información
    if (!results || results.length === 0) {
      return NextResponse.json({ message: "Información no encontrada" }, { status: 404 });
    }

    return NextResponse.json(results[0]); // Retornar el primer resultado
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener la información", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Token inválido", error: err.message },
        { status: 400 }
      );
    }

    const userId = decoded.id; // ID del usuario autenticado

    // Leer el body de la solicitud
    const data = await req.json();

    // Actualizar la información en la base de datos
    await conn.query(
      `
      UPDATE identificacion SET
        iden_curp = ?, iden_rfc = ?, iden_fecha_nacimiento = ?,
        iden_nacionalidad = ?, iden_entidad = ?, iden_estado_civil = ?,
        iden_telefono = ?, iden_email = ?, iden_email_alternativo = ?,
        iden_area_dedicacion = ?, iden_disciplina_dedicacion = ?
      WHERE iden_id_profesor = ?
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
        userId, // Se asegura de que el usuario solo edite su información
      ]
    );

    return NextResponse.json({ message: "Información actualizada con éxito" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al actualizar información", error: error.message },
      { status: 500 }
    );
  }
}
