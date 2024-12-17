import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const data = await request.json();
    const { us_usuario, us_contrasena } = data;

    // Consulta a la base de datos para verificar el usuario y obtener la descripción del rol
    const [userResult] = await conn.query(`
      SELECT
        usuarios.us_id,
        usuarios.us_usuario,
        usuarios.us_contrasena,
        roles.rol_id,
        roles.rol_descripcion
      FROM
        usuarios
      JOIN
        roles ON usuarios.us_rol_id = roles.rol_id
      WHERE
        usuarios.us_usuario = ?
      AND usuarios.us_es_id = 1
    `, [us_usuario]);

    if (!userResult) {
      return NextResponse.json({
        message: "Usuario o contraseña incorrectos.",
      }, {
        status: 401,
      });
    }

    const user = userResult;
    // Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(us_contrasena, user.us_contrasena);

    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Usuario o contraseña incorrectos.",
      }, {
        status: 401,
      });
    }

    // Si la contraseña es válida, generar el token JWT
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Token válido por 30 días
        id: user.us_id,
        username: user.us_usuario, // Incluye el nombre de usuario en el payload
        role: {
          id: user.rol_id, // Incluye el ID del rol
          description: user.rol_descripcion // Incluye la descripción del rol
        }
      },
      JWT_SECRET // Clave secreta para firmar el token desde la variable de entorno
    );

    // Serializar el token en una cookie
    const serialized = serialize('myTokenName', token, {
      httpOnly: true, // La cookie solo está disponible para el servidor
      secure: 'production', // La cookie solo se envía a través de HTTPS en producción
      sameSite: 'strict', // La cookie solo se envía con solicitudes del mismo sitio
      maxAge: 60 * 60 * 24, // Tiempo de vida de la cookie de 1 días
      path: '/', // La cookie está disponible en toda la aplicación
    });

    // Establecer la cabecera 'Set-Cookie' para enviar la cookie al cliente
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      role: {
        id: user.rol_id,
        description: user.rol_descripcion
      }
    });

    response.headers.set('Set-Cookie', serialized);
    return response;

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: error.message,
    }, {
      status: 500,
    });
  }
}
