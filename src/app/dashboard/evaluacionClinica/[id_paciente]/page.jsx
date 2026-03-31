'use client'

import {useState, useEffect} from "react";

export default function () {
    const [id_paciente, setId_paciente] = useState(null);
    const[id_ficha_clinica, setId_ficha_clinica] = useState(null);
    const[tipo_evaluacion, setTipo_evaluacion] = useState("");
    const[version_protocolo,setVersion_protocolo] = useState("");
    const[estado, setEstado] = useState("");
    const[fecha_evaluacion, setFechaEvaluacion] = useState("");
    const[profesional_id,setProfesionalId] = useState("");
    const[peso_kg,setPeso_kg] = useState(null);
    const[talla_cm,setTalla_cm] = useState(null);
    const[cintura_cm,setCintura_cm] = useState(null);
    const[imc,setImc] = useState(null);
    const[pa_diastolica,setPaDiastolica] = useState(null);
    const[actividad_fisica, setActividad_fisica] = useState("");
    const[motivo_consulta, setMotivo_consulta] = useState("");
    const[medicamentos_actuales, setMedicamentos_actuales] = useState("");
    const[alergias,setAlergias] = useState("");
    const[tratamientos_previos_obesidad, setTratamientos_previos_obesidad] = useState("");
    const[historia_familiar,setHistoria_familiar] = useState("");
    const[observaciones_clinicas,setObservaciones_clinicas] = useState("");
    const[resultado_elegibilidad, setResultado_elegibilidad] = useState("");
    const[justificacion_resultado,setjustificacion_resultado] = useState("");
    const[score_total,setScore_total] = useState(null);
    const[fecha_creacion,setFecha_creacion] = useState("");
    const[id_evaluacion,setId_evaluacion] = useState(null);




    return(
        <div>

        </div>
    )
}