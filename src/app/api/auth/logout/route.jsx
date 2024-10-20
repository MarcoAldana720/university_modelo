import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request) {
  try {
    const serialized = serialize('myTokenName', null, {
      httpOnly: true,
      secure: 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    const response = NextResponse.json({
      message: "Cierre de sesión exitoso",
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
