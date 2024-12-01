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

  const [showPassword, setShowPassword] = useState(false);

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
  
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="container_login bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="container_center bg-white shadow-lg rounded-lg p-8">

        <figure className="container_img flex justify-center mb-6">
          <img src="/img/logo_original.png" alt="Universidad Modelo" className="w-32" />
        </figure>

        <form 
        onSubmit={handleSubmit} 
        method="post" 
        className="space-y-4"
        >
          <div>
            <label htmlFor="us_usuario" className="block text-gray-700 font-semibold mb-1">Usuario:</label>
            <input
              type="text"
              id="us_usuario"
              name="us_usuario"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="us_contrasena" className="block text-gray-700 font-semibold mb-1">Contraseña:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="us_contrasena"
              name="us_contrasena"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              id="toggle-password"
              className="absolute right-3 top-8 cursor-pointer text-gray-600"
              onClick={togglePasswordVisibility}
            >
              <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
              </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
