"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    us_usuario: "",
    us_contrasena: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", credentials);

      if (response.status === 200) {
        const { role } = response.data;
        if (role.id === 1) {
          router.push("/admin/dashboard");
        } else if (role.id === 2) {
          router.push("/client/identify");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Usuario Y/O Contraseña Incorrectos");
    }
  };

  return (
    <div className="container_login">
      <div className="container_center">
        <figure className="container_img">
          <img src="/img/logo_original.png" alt="Universidad Modelo" />
        </figure>
        <form onSubmit={handleSubmit}>
          <label htmlFor="us_usuario">Usuario:</label>
          <br />
          <input type="text" id="us_usuario" name="us_usuario" required onChange={handleChange}/>
          <br /><br />
          <label htmlFor="us_contrasena">Contraseña:</label>
          <br />
          <input type="password" id="us_contrasena" name="us_contrasena" required onChange={handleChange}/>
          <br /><br />
          <button type="submit">Iniciar Sesión</button>
          <br />
        </form>
      </div>
    </div>
  );
}
