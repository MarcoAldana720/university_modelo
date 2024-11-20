"use client"

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";

async function loadData(lg_id) {
  try {
    const { data } = await axios.get(`/api/client/generationline/${lg_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error Al Cargar Los Datos De Linea De Generación.");
  }
}

export default function EditStudies({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [info, setInfo] = useState({
    li_linea: "",
    lg_actividad_realiza: "",
  });

  useEffect(() => {
    loadData(id)
      .then((data) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id]);

  const closeModal = () => {
    router.replace(pathname);
  };

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/client/generationline/${id}`, info);
      toast.success(response.data.message || "Linea De Generación Actualizado Correctamente.");
      router.refresh();
      router.push('/client/generationline');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error Al Actualizar La Linea De Generación.");
    }
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit} method="post">
            <label htmlFor="li_linea">linea:</label><br />
            <span id="li_linea">{info.li_linea}</span><br />
            {/* <input type="text" name="li_linea" id="li_linea" onChange={handleChange} value={info.li_linea} disabled readOnly /><br /> */}

            <label htmlFor="lg_actividad_realiza">actividad que realiza:</label><br />
            <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" onChange={handleChange} value={info.lg_actividad_realiza} required /><br />

            <div className="btn">
              <button type="submit">guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
