import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { conn } from '../../../../libs/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { serialize } from "cookie";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// ENDPOINT PARA VISUALIZAR LOS DATOS DE USUARIO QUE INICIÓ SESIÓN
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'No token provided'
        }, {
          status: 401
        }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userid = decoded.id;

    const [userResult] = await conn.query(`
      SELECT
        usuarios.us_nombres,
        usuarios.us_apellido_paterno,
        usuarios.us_apellido_materno,
        usuarios.us_usuario,
        roles.rol_id,
        roles.rol_descripcion
      FROM
        usuarios
      JOIN
        roles ON usuarios.us_rol_id = roles.rol_id
      WHERE
        usuarios.us_id = ?
    `, [userid]);

    if (!userResult) {
      return NextResponse.json(
        {
          message: 'User not found'
        }, {
          status: 404
        }
      );
    }

    return NextResponse.json(userResult);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}

// ENDPOINT PARA QUE EL USUARIO PUEDA ACTUALIZAR SU PERFIL
export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'No token provided'
        }, {
          status: 401
        }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return NextResponse.json(
        {
          message: 'Token verification failed'
        }, {
          status: 401
        }
      );
    }

    if (!decoded || !decoded.username || !decoded.id) {
      return NextResponse.json({ message: 'Invalid token data' }, { status: 400 });
    }

    const userId = decoded.id; // Extrae el ID del token decodificado
    const data = await request.json();

    let updatedPassword = data.us_contrasena;

    if (updatedPassword) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(updatedPassword, salt);
    }

    // Actualizar el usuario en la base de datos
    await conn.query(`
      UPDATE usuarios SET
        us_nombres = ?,
        us_apellido_paterno = ?,
        us_apellido_materno = ?,
        us_usuario = ?,
        us_contrasena = IF(?, ?, us_contrasena)
      WHERE
        us_id = ?
    `, [
      data.us_nombres,
      data.us_apellido_paterno,
      data.us_apellido_materno,
      data.us_usuario,
      updatedPassword ? 1 : 0,
      updatedPassword,
      userId // Usa el ID para identificar al usuario en la base de datos
    ]);

    // Generar un nuevo token con los datos actualizados, incluyendo el ID
    const newToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Token válido por 30 días
        id: userId,
        username: data.us_usuario,
        role: {
          id: decoded.role.id,
          description: decoded.role.description,
        }
      },
      JWT_SECRET,
    );

    // Configurar la cookie con el nuevo token
    const response = NextResponse.json(
      {
        message: 'User updated successfully'
      }
    );

    // Serializar el token en una cookie
    const serialized = serialize('myTokenName', token, {
      httpOnly: true, // La cookie solo está disponible para el servidor
      secure: 'production', // La cookie solo se envía a través de HTTPS en producción
      sameSite: 'strict', // La cookie solo se envía con solicitudes del mismo sitio
      maxAge: 60 * 60 * 24, // Tiempo de vida de la cookie de 1 días
      path: '/', // La cookie está disponible en toda la aplicación
    });

    response.headers.set('Set-Cookie', serialized);

    return response;

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}
