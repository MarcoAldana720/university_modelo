"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import ReportsIcon from "../../assets/ReportsIcon";

export default function ExportInfo() {
  // Función para formatear la fecha al formato DD/MM/YYYY
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "N/A";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const generatePDF = async () => {
    try {
      // Obtener datos actualizados de las APIs
      const [professorResponse, studiesResponse, workResponse, generationLineResponse] = await Promise.all([
        axios.get("/api/client/identify"),
        axios.get("/api/client/studies"),
        axios.get("/api/client/employmentdata"),
        axios.get("/api/client/generationline"),
      ]);

      const professorInfo = professorResponse.data;
      const studiesData = studiesResponse.data;
      const workData = workResponse.data;
      const generationLineData = generationLineResponse.data;

      if (professorInfo.length === 0 && studiesData.length === 0 && workData.length === 0 && generationLineData.length === 0) {
        alert("No hay datos para exportar.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(12);
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10; // Márgenes laterales
      let currentY = 22; // Inicializa la posición Y para el contenido

      // Función para centrar el texto
      const centerText = (text, y) => {
        const textWidth = doc.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
      };

      // Configuración de estilos uniformes
      const tableStyles = {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.1,
        fillColor: [255, 255, 255], // Fondo blanco
        textColor: [0, 0, 0], // Texto negro
        fontStyle: "normal", // Estilo normal
        overflow: "linebreak",
      };

      // Agregar índice al principio
      centerText("Curriculum", currentY);
      currentY += 5;

      const indexBody = [
        ["Sección", "Número De Registros"],
        ["Identificación del Profesor", professorInfo ? 1 : 0],
        ["Estudios Realizados", studiesData.length],
        ["Datos Laborales", workData.length],
        ["Líneas de Generación", generationLineData.length],
      ];

      doc.autoTable({
        head: [indexBody[0]], // Encabezados de la tabla
        body: indexBody.slice(1), // Filas de la tabla
        startY: currentY,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: tableStyles,
        columnStyles: {
          0: { cellWidth: (pageWidth - margin * 2) * 0.5 },
          1: { cellWidth: (pageWidth - margin * 2) * 0.5 },
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Centrar el título para estudios
      centerText("Identificacion Del Profesor", currentY);
      currentY += 5;

      const professorInfoArray = Array.isArray(professorInfo) ? professorInfo : [professorInfo];

      if (professorInfoArray.length > 0) {
        professorInfoArray.forEach((professor) => {
          const body = [
            ["Nombre", `${professor.us_nombres} ${professor.us_apellido_paterno} ${professor.us_apellido_materno}`],
            ["RFC", professor.iden_rfc || "N/A"],
            ["CURP", professor.iden_curp || "N/A"],
            ["Género", professor.genero || "N/A"],
            ["Fecha de Nacimiento", formatDate(professor.iden_fecha_nacimiento)],
            ["Nacionalidad", professor.iden_nacionalidad || "N/A"],
          ];

          doc.autoTable({
            body,
            startY: currentY,
            margin: { left: margin, right: margin },
            theme: "grid",
            styles: tableStyles,
            columnStyles: {
              0: { cellWidth: (pageWidth - margin * 2) * 0.5 },
              1: { cellWidth: (pageWidth - margin * 2) * 0.5 },
            },
          });

          currentY = doc.lastAutoTable.finalY + 10;
        });
      } else {
        doc.text("No se encontró información del profesor.", margin, currentY);
        currentY += 10;
      }

      // Centrar el título para estudios
      centerText("Estudios Realizados", currentY);
      currentY += 5;

      // Agregar datos de estudios en formato vertical
      if (studiesData.length > 0) {
        studiesData.forEach((study) => {
          const body = [
            ["Nivel de Estudios", study.est_nivel_estudios || "N/A"],
            ["Área de Estudio", study.est_area_estudio || "N/A"],
            ["Disciplina", study.est_disciplina_estudio || "N/A"],
            ["Institución Otorgante", study.est_institucion_otorgante || "N/A"],
            ["País", study.est_pais_institucion || "N/A"],
            ["Fecha de Obtención", formatDate(study.est_fecha_obtencion_titulo)],
          ];

          doc.autoTable({
            body,
            startY: currentY,
            margin: { left: margin, right: margin },
            theme: "grid",
            styles: tableStyles,
            columnStyles: {
              0: { cellWidth: (pageWidth - margin * 2) * 0.5 },
              1: { cellWidth: (pageWidth - margin * 2) * 0.5 },
            },
            showHead: "never",
          });

          currentY = doc.lastAutoTable.finalY + 8;
        });
      } else {
        doc.text("No hay estudios realizados disponibles.", margin, currentY);
        currentY += 10;
      }

      // Centrar el título para datos laborales
      centerText("Datos Laborales", currentY);
      currentY += 5;

      // Agregar datos laborales en formato vertical
      if (workData.length > 0) {
        workData.forEach((work) => {
          const body = [
            ["Nombramiento", work.da_nombramiento || "N/A"],
            ["Horas de Contrato", work.da_hrs_contrato || "N/A"],
            ["Escuela Pertenece", work.da_escuela_pertenece || "N/A"],
            ["Inicio de Contrato", formatDate(work.da_inicio_contrato)],
            ["Unidad", work.da_unidad || "N/A"],
            ["Campus", work.da_campus || "N/A"],
          ];

          doc.autoTable({
            body,
            startY: currentY,
            margin: { left: margin, right: margin },
            theme: "grid",
            styles: tableStyles,
            columnStyles: {
              0: { cellWidth: (pageWidth - margin * 2) * 0.5 },
              1: { cellWidth: (pageWidth - margin * 2) * 0.5 },
            },
            showHead: "never",
          });

          currentY = doc.lastAutoTable.finalY + 8;
        });
      } else {
        doc.text("No hay datos laborales disponibles.", margin, currentY);
        currentY += 10;
      }

      // Centrar el título para líneas de generación
      centerText("Líneas de Generación", currentY);
      currentY += 5;

      // Agregar datos de líneas de generación
      if (generationLineData.length > 0) {
        generationLineData.forEach((line) => {
          const body = [
            ["Nombre de Línea", line.li_linea || "N/A"],
            ["Actividad Realizada", line.lg_actividad_realiza || "N/A"],
          ];

          doc.autoTable({
            body,
            startY: currentY,
            margin: { left: margin, right: margin },
            theme: "grid",
            styles: tableStyles,
            columnStyles: {
              0: { cellWidth: (pageWidth - margin * 2) * 0.5 },
              1: { cellWidth: (pageWidth - margin * 2) * 0.5 },
            },
            showHead: "never",
          });

          currentY = doc.lastAutoTable.finalY + 8;
        });
      } else {
        doc.text("No hay líneas de generación disponibles.", margin, currentY);
      }

      doc.save("curriculum.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");
    }
  };

  return (
    <button onClick={generatePDF} className="capitalize w-full flex px-3 rounded-md items-center justify-between gap-2 py-3 transition duration-300 hover:bg-white hover:text-primary group/link" >
      <div className="flex items-center gap-4">
        <ReportsIcon width={20} className="fill-white group-hover/link:fill-primary inline-block" />
        <span>exportar</span>
      </div>
    </button>
  );
}
