import { conn } from "../../../../../libs/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function PUT(request, { params }) {
  try {
    const newPassword = 'unimodelo';

    // Encriptar la contraseña antes de guardarla
    const saltRounds = 10; // Puedes ajustar el número de rondas de salt
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar solo la contraseña encriptada
    const result = await conn.query(
      "UPDATE usuarios SET us_contrasena = ? WHERE us_id = ?",
      [encryptedPassword, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Usuario No Encontrado",
        }, {
          status: 404,
        }
      );
    }

    // Devolver la contraseña original en la respuesta JSON para propósitos de prueba
    return NextResponse.json(
      {
        message: "Contraseña actualizada correctamente",
        newPassword: newPassword, // Esto devolverá la contraseña original (no encriptada) en la respuesta
      }, {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      }, {
        status: 500,
      }
    );
  }
}
