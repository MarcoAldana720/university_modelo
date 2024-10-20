import { NextResponse } from "next/server";
import { conn } from "../../../libs/db";
import bcrypt from "bcrypt";

// FUNCION PARA PODER MOSTRAR TODOS LOS USUARIOS
export async function GET() {
  try {
    const results = await conn.query(`
      SELECT
        usuarios.us_id,
        usuarios.us_nombres,
        usuarios.us_apellidos,
        usuarios.us_usuario,
        usuarios.us_correo,
        generos.gen_descripcion,
        roles.rol_descripcion,
        escuelas.esc_descripcion,
        estados.es_descripcion
      FROM
        usuarios
      JOIN
        generos ON usuarios.us_gen_id = generos.gen_id
      JOIN
        roles ON usuarios.us_rol_id = roles.rol_id
      JOIN
        estados ON usuarios.us_es_id = estados.es_id
      JOIN
        escuelas ON usuarios.us_esc_id = escuelas.esc_id
      WHERE
        roles.rol_descripcion IN ('profesor')
      ORDER BY
        usuarios.us_nombres ASC
    `);

    return NextResponse.json(results);

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

// FUNCION PARA PODER VALIDAR Y REGISTRAR UN NUEVO USUARIO
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      us_nombres,
      us_apellidos,
      us_usuario,
      us_correo,
      us_gen_id,
      us_rol_id,
      us_esc_id,
    } = data;

    const existingUser = await conn.query("SELECT * FROM usuarios WHERE us_usuario = ? OR us_correo = ?", [us_usuario, us_correo]);

    if (existingUser.length > 0) {
      return NextResponse.json({
        message: "El Usuario O Correo Electrónico Ya Existe.",
      }, {
        status: 400,
      });
    }

    // Definir la contraseña por defecto
    const defaultPassword = "unimodelo";

    // Hash la contraseña por defecto
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // Establecer el estado del usuario como "alta" (us_estado_id = 1)
    const us_es_id = 1;

    const result = await conn.query("INSERT INTO usuarios SET ?", {
      us_nombres,
      us_apellidos,
      us_usuario,
      us_correo,
      us_contrasena: hashedPassword,
      us_gen_id,
      us_rol_id,
      us_esc_id,
      us_es_id,
    });

    return NextResponse.json({
      us_nombres,
      us_apellidos,
      us_usuario,
      us_correo,
      us_gen_id,
      us_rol_id,
      us_esc_id,
      us_es_id,
      us_id: result.insertId,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      }, {
        status: 500,
      }
    );
  }
}
