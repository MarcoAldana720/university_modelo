import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request) {
  try {
    // Configura la cookie para invalidarla inmediatamente
    const serialized = serialize('myTokenName', '', {
      httpOnly: true,    // Solo accesible desde el servidor
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS en producción
      sameSite: 'strict', // Estricto para evitar envío en solicitudes de terceros
      expires: new Date(0),  // Establece una fecha de expiración pasada
      path: '/',  // Asegura que la cookie se envíe para todas las rutas
    });

    // Responde con un mensaje de cierre de sesión exitoso
    const response = NextResponse.json({
      message: "Cierre de sesión exitoso",
    });

    // Establece la cookie de cierre de sesión en la respuesta
    response.headers.set('Set-Cookie', serialized);

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: error.message,
    }, {
      status: 500,
    });
  }
}
