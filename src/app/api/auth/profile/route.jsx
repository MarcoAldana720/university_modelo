import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { conn } from '../../../../libs/db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// ENDPOINT PARA VISUALIZAR LOS DATOS DE USUARIO QUE INICIÓ SESIÓN
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const username = decoded.username;

    const [userResult] = await conn.query(`
      SELECT
        usuarios.us_nombres,
        usuarios.us_apellidos,
        usuarios.us_usuario,
        usuarios.us_correo,
        roles.rol_id,
        roles.rol_descripcion
      FROM
        usuarios
      JOIN
        roles ON usuarios.us_rol_id = roles.rol_id
      WHERE
        usuarios.us_usuario = ?
    `, [username]);

    if (!userResult) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userResult);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ENDPOINT PARA QUE EL USUARIO PUEDA ACTUALIZAR SU PERFIL
export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return NextResponse.json({ message: 'Token verification failed' }, { status: 401 });
    }

    if (!decoded || !decoded.username) {
      return NextResponse.json({ message: 'Invalid token data' }, { status: 400 });
    }

    const username = decoded.username;
    const data = await request.json();

    let updatedPassword = data.us_contrasena;

    if (updatedPassword) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(updatedPassword, salt);
    }

    await conn.query(`
      UPDATE usuarios SET
        us_nombres = ?,
        us_apellidos = ?,
        us_usuario = ?,
        us_correo = ?,
        us_contrasena = IF(?, ?, us_contrasena)
      WHERE
        us_usuario = ?
    `, [data.us_nombres, data.us_apellidos, data.us_usuario, data.us_correo, updatedPassword ? 1 : 0, updatedPassword, username]);

    const newToken = jwt.sign(
      {
        username: data.us_usuario,
        role: {
          id: decoded.role.id,
          description: decoded.role.description
        },
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
      },
      JWT_SECRET,
    );

    const response = NextResponse.json({ message: 'User updated successfully' });
    response.headers.set('Set-Cookie', `myTokenName=${newToken}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);

    return response;

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
