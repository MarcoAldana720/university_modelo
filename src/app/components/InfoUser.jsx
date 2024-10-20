"use client";

import ButtonEdit from "./ButtonEdit";
import ButtonResetPassword from "./ButtonResetPassword";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditUser from "./EditUser";
import ExportInfo from "./ExportInfo";

export default function InfoUser({ userId, searchParams }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
        try {
            const { data } = await axios.get(`/api/admin/${userId}`);
            setUser(data);
        } catch (error) {
            console.log(error);
        }
        };

        loadUser();
    }, [userId]);

    // Si no hay datos de usuario, devuelve un componente vacío
    if (!user) {
        return null;
    }

    const { us_id, us_nombres, us_apellidos, rol_descripcion, esc_descripcion, es_descripcion } = user;

    // Función para mostrar las iniciales
    const getInitials = (nombres, apellidos) => {
        const firstNameInitial = nombres ? nombres.charAt(0) : '';
        const lastNameInitial = apellidos ? apellidos.charAt(0) : '';
        return firstNameInitial + lastNameInitial;
    };

    const initials = getInitials(us_nombres, us_apellidos);

    return (
        <div className="custom_container">
        <EditUser show={Boolean(searchParams.edit)} />
        <Link href="/admin/usuarios">&lt; regresar</Link><br /><br />

        <div className="profile_card">
            <div className="profile_initials">{initials}</div>
            <h1 className="profile_name">{`${us_nombres} ${us_apellidos}`}</h1>
            <div className="profile_center">
                <p className="profile_description">cargo: {rol_descripcion}</p>
                <p className="profile_description">escuela: {esc_descripcion}</p>
                <p className="profile_description">estado: {es_descripcion}</p>
            </div><br />

            {/* Permite Restablecer La Contraseña */}
            <ButtonResetPassword us_id={us_id} />
            {/* Permite Exportar La Información En Formato PDF */}
            <ExportInfo userId={us_id} />
            {/* Permite Editar La Información */}
            <ButtonEdit id={us_id} />
        </div>
        </div>
    );
}