import { conn } from "../../../../libs/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
      const result = await conn.query(`SELECT * FROM generos`);
      
      if (result.length === 0) {
        return NextResponse.json(
          {
          message: "Generos No Entontrado",
          }, {
          status: 404,
          }
        );
      }
  
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({
        message: error.message,
      }, {
        status: 500,
      })
    }
  }
