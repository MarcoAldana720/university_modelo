"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export default function ExportInfo({ userId }) {
  // Función para formatear la fecha al formato DD/MM/YYYY
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";

    const date = new Date(isoDate);
    return isNaN(date.getTime())
      ? "N/A"
      : `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Función principal para generar el PDF
  const generatePDF = async () => {
    try {
      // Llamada a la API con el ID dinámico
      const response = await axios.get(
        `/api/admin/export/identify/${userId}`
      );

      const professorInfo = response.data;

      if (!professorInfo || Object.keys(professorInfo).length === 0) {
        alert("No hay datos para exportar.");
        return;
      }

      // Configuración del PDF
      const doc = new jsPDF();
      doc.setFontSize(12);
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      let currentY = 20;

      // Función para centrar texto
      const centerText = (text, y) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pageWidth - textWidth) / 2, y);
      };

      // Estilos de la tabla
      const tableStyles = {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.1,
        theme: "grid",
      };

      // Título principal
      centerText("Información del Profesor", currentY);
      currentY += 10;

      // Tabla con información del profesor
      const body = [
        ["Nombre", `${professorInfo.us_nombres} ${professorInfo.us_apellido_paterno} ${professorInfo.us_apellido_materno}`],
        ["RFC", professorInfo.iden_rfc || "N/A"],
        ["CURP", professorInfo.iden_curp || "N/A"],
        ["Género", professorInfo.genero || "N/A"],
        ["Fecha de Nacimiento", formatDate(professorInfo.iden_fecha_nacimiento)],
        ["Nacionalidad", professorInfo.iden_nacionalidad || "N/A"],
      ];

      doc.autoTable({
        body,
        startY: currentY,
        margin: { left: margin, right: margin },
        styles: tableStyles,
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: pageWidth - margin * 2 - 60 },
        },
      });

      // Guardar el PDF
      doc.save(`informacion_profesor_${userId}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");
    }
  };

  return (
    <button onClick={generatePDF} className="btn_export">exportar PDF</button>
  );
}





// EL CODIGO DE ABAJO SOLAMENTE ES PARA EJEMPLO
/*
"use client"

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

export default function ExportInfo({ userId }) {
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

        doc.save("curriculum.pdf");
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");
      }
    };

    return (
        <button onClick={generatePDF} className="btn_export">Exportar PDF</button>
    );
}
*/