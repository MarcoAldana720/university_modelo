"use client"

import Link from 'next/link'

export default function FormProduction() {
  return (
    <section className="custom_container">
      <Link href="/client/academicproduction">&lt; regresar</Link><br /><br />
      <div className="form_blocked">
        <form action="" method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              <label htmlFor="us_curp">clave única de registro de población (CURP):</label><br />
              <input type="text" name="us_curp" id="us_curp" disabled /><br />

              <label htmlFor="us_rfc">registro federal de contribuyente (RFC):</label><br />
              <input type="text" name="us_rfc" id="us_rfc" disabled /><br />

              <label htmlFor="us_nombres">nombre (s):</label><br />
              <input type="text" name="us_nombres" id="us_nombres" disabled /><br />

              <label htmlFor="us_apellido_p">apellido paterno:</label><br />
              <input type="text" name="us_apellido_p" id="us_apellido_p" disabled /><br />

              <label htmlFor="us_apellido_m">apellido materno:</label><br />
              <input type="text" name="us_apellido_m" id="us_apellido_m" disabled /><br />

              <label htmlFor="us_genero">género:</label><br />
              <input type="text" name="us_genero" id="us_genero" disabled /><br />

              <label htmlFor="us_nacionalidad">nacionalidad:</label><br />
              <input type="text" name="us_nacionalidad" id="us_nacionalidad" disabled /><br />

              <label htmlFor="us_fecha">fecha de nacimiento:</label><br />
              <input type="date" name="us_fecha" id="us_fecha" disabled /><br />
            </div>
            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
              <label htmlFor="us_entidad">entidad de nacimiento:</label><br />
              <input type="text" name="us_entidad" id="us_entidad" disabled /><br />

              <label htmlFor="us_civil">estado civil:</label><br />
              <input type="text" name="us_civil" id="us_civil" disabled /><br />

              <label htmlFor="us_tel">telefono celular:</label><br />
              <input type="tel" name="us_tel" id="us_tel" disabled /><br />

              <label htmlFor="us_email">correo electrónico:</label><br />
              <input type="email" name="us_email" id="us_email" disabled /><br />

              <label htmlFor="us_email_alt">correo electrónico alternativo:</label><br />
              <input type="email" name="us_email_alt" id="us_email_alt" disabled /><br />

              <label htmlFor="us_area">área a la que se dedica:</label><br />
              <input type="text" name="us_area" id="us_area" disabled /><br />

              <label htmlFor="us_disciplina">disciplina a la que se dedica:</label><br />
              <input type="text" name="us_disciplina" id="us_disciplina" disabled /><br />
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <button type="submit">editar</button>
            <button type="submit">eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
