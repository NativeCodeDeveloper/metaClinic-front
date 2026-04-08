'use client'
import React, { useEffect, useState } from 'react';
import { InputTextDinamic } from "@/Componentes/InputTextDinamic";
import { TextAreaDinamic } from "@/Componentes/TextAreaDinamic";
import { ButtonDinamic } from "@/Componentes/ButtonDinamic";
import { SelectDinamic } from "@/Componentes/SelectDinamic";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from 'react-hot-toast';

export default function CriteriosClinicos() {
    const [listaCriteriosClinicos, setListaCriteriosClinicos] = useState([]);
    const [listaExcluyentesGLP1, setListaExcluyentesGLP1] = useState([]);
    const [listaCriteriosValorTipo, setListaCriteriosValorTipo] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [valor_tipo, setValorTipo] = useState('');
    const [excluye_glp1, setExcluyeGlp1] = useState('0');
    const [fecha_creacion, setFechaCreacion] = useState('');
    const [id_criterio, setIdCriterio] = useState('');
    const [valor_tipo_filtro, setValorTipoFiltro] = useState('');
    const API = process.env.NEXT_PUBLIC_API_URL;

    async function obtenerTodosActivos() {
        try {
            const res = await fetch(`${API}/criteriosClinicos/obtenerTodosActivos`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar los criterios clínicos, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(Array.isArray(respustaBackend)){
                    setListaCriteriosClinicos(respustaBackend);
                }else{
                    return toast.error('Error al cargar los criterios clínicos, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los criterios clínicos, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        obtenerTodosActivos();
    },[])

    async function obtenerExcluyentesGLP1() {
        try {
            const res = await fetch(`${API}/criteriosClinicos/obtenerExcluyentesGLP1`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar los criterios excluyentes GLP1, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(Array.isArray(respustaBackend)){
                    setListaExcluyentesGLP1(respustaBackend);
                }else{
                    return toast.error('Error al cargar los criterios excluyentes GLP1, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los criterios excluyentes GLP1, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        obtenerExcluyentesGLP1();
    }, []);

    function limpiarFormulario() {
        setNombre('');
        setDescripcion('');
        setValorTipo('');
        setExcluyeGlp1('0');
        setFechaCreacion('');
        setIdCriterio('');
    }

    async function obtenerPorId(id_criterio) {
        try {
            if(!id_criterio){
                return toast.error('Por favor seleccione un criterio clínico para continuar con la edición.');
            }

            const res = await fetch(`${API}/criteriosClinicos/obtenerPorId`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id_criterio}),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al seleccionar el criterio clínico, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(Array.isArray(respustaBackend) && respustaBackend.length > 0){
                    setNombre(respustaBackend[0].nombre || '');
                    setDescripcion(respustaBackend[0].descripcion || '');
                    setValorTipo(respustaBackend[0].valor_tipo || '');
                    setExcluyeGlp1(String(respustaBackend[0].excluye_glp1 ?? 0));
                    setFechaCreacion(respustaBackend[0].fecha_creacion || '');
                    setIdCriterio(String(respustaBackend[0].id_criterio));
                    return toast.success('Criterio clínico seleccionado correctamente.');
                }else{
                    return toast.error('Error al seleccionar el criterio clínico, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al seleccionar el criterio clínico, por favor intente nuevamente.');
        }
    }

    async function crearCriterio(nombre, descripcion, valor_tipo, excluye_glp1) {
        try {
            if(!nombre || !descripcion || !valor_tipo){
                return toast.error('Por favor complete nombre, descripción y tipo de valor para crear el criterio clínico.');
            }

            const res = await fetch(`${API}/criteriosClinicos/crear`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    valor_tipo,
                    excluye_glp1: Number(excluye_glp1)
                }),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al crear el criterio clínico, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(respustaBackend.message === true){
                    limpiarFormulario();
                    await obtenerTodosActivos();
                    await obtenerExcluyentesGLP1();
                    return toast.success('Criterio clínico creado correctamente.');
                }else{
                    return toast.error('Error al crear el criterio clínico, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al crear el criterio clínico, por favor intente nuevamente.');
        }
    }

    async function actualizarCriterio(nombre, descripcion, valor_tipo, excluye_glp1, fecha_creacion, id_criterio) {
        try {
            if(!nombre || !descripcion || !valor_tipo || !fecha_creacion || !id_criterio){
                return toast.error('Por favor seleccione un criterio y complete todos los campos para actualizar.');
            }

            const res = await fetch(`${API}/criteriosClinicos/actualizarCriterio`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    valor_tipo,
                    excluye_glp1: Number(excluye_glp1),
                    fecha_creacion,
                    id_criterio: Number(id_criterio)
                }),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al actualizar el criterio clínico, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(respustaBackend.message === true){
                    limpiarFormulario();
                    await obtenerTodosActivos();
                    await obtenerExcluyentesGLP1();
                    if(valor_tipo_filtro){
                        await obtenercriterios_valor_tipo(valor_tipo_filtro);
                    }
                    return toast.success('Criterio clínico actualizado correctamente.');
                }else{
                    return toast.error('Error al actualizar el criterio clínico, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al actualizar el criterio clínico, por favor intente nuevamente.');
        }
    }

    async function eliminarCriterio(id_criterio) {
        try {
            if(!id_criterio){
                return toast.error('Por favor seleccione un criterio clínico para continuar con la eliminación.');
            }

            const res = await fetch(`${API}/criteriosClinicos/eliminarCriterio`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id_criterio: Number(id_criterio)}),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al eliminar el criterio clínico, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(respustaBackend.message === true){
                    limpiarFormulario();
                    await obtenerTodosActivos();
                    await obtenerExcluyentesGLP1();
                    if(valor_tipo_filtro){
                        await obtenercriterios_valor_tipo(valor_tipo_filtro);
                    }
                    return toast.success('Criterio clínico eliminado correctamente.');
                }else{
                    return toast.error('Error al eliminar el criterio clínico, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al eliminar el criterio clínico, por favor intente nuevamente.');
        }
    }

    async function obtenercriterios_valor_tipo(valor_tipo) {
        try {
            if(!valor_tipo){
                setListaCriteriosValorTipo([]);
                return toast.error('Por favor seleccione un tipo de valor para filtrar criterios clínicos.');
            }

            const res = await fetch(`${API}/criteriosClinicos/obtenercriterios_valor_tipo`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({valor_tipo}),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al filtrar los criterios clínicos, por favor intente nuevamente.');
            }else{
                const respustaBackend = await res.json();

                if(Array.isArray(respustaBackend)){
                    setListaCriteriosValorTipo(respustaBackend);
                    return toast.success('Filtro aplicado correctamente.');
                }else{
                    return toast.error('Error al filtrar los criterios clínicos, por favor intente nuevamente.');
                }
            }
        } catch (error) {
            return toast.error('Error al filtrar los criterios clínicos, por favor intente nuevamente.');
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fafc_42%,#ffffff_100%)]">
            <ToasterClient />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
                <div className="relative mb-8 overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.4)] backdrop-blur sm:p-8">
                    <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
                    <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-100 blur-3xl" />

                    <div className="relative max-w-3xl space-y-4">
                            <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium tracking-wide text-blue-700">
                                Gestión clínica
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                    Criterios clínicos
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                    Administra criterios activos, exclusiones GLP1 y filtros por tipo de valor desde una interfaz más clara, consistente y cómoda de usar.
                                </p>
                            </div>
                    </div>
                </div>

                <div className="mt-8 rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                Formulario principal
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Ingreso y edición
                                <span className="ml-2 text-blue-700">(Criterio clínico)</span>
                            </h2>
                            <p className="max-w-2xl text-sm leading-6 text-slate-500">
                                Complete los campos para crear o actualizar un criterio clínico según la tabla `criterios_clinicos`.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Nombre del criterio</label>
                                    <InputTextDinamic
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ej: Embarazo"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <p className="text-xs text-slate-400">Campo requerido para crear y actualizar.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Tipo de valor</label>
                                    <SelectDinamic
                                        value={valor_tipo}
                                        onChange={(e) => setValorTipo(e.target.value)}
                                        placeholder="Seleccione el tipo de valor"
                                        options={[
                                            { value: 'positivo', label: 'Positivo' },
                                            { value: 'negativo', label: 'Negativo' }
                                        ]}
                                        className="border-slate-200 bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Excluye GLP1</label>
                                    <SelectDinamic
                                        value={excluye_glp1}
                                        onChange={(e) => setExcluyeGlp1(e.target.value)}
                                        placeholder="Seleccione una opción"
                                        options={[
                                            { value: '1', label: 'Sí, excluye GLP1' },
                                            { value: '0', label: 'No excluye GLP1' }
                                        ]}
                                        className="border-slate-200 bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Descripción</label>
                                    <TextAreaDinamic
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Ej: Paciente en estado de gestación"
                                        className="min-h-[140px] w-full border-slate-200 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-5">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Resumen del formulario</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            Mantiene visible el estado actual del registro mientras editas o preparas una nueva carga.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Criterio cargado</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">{nombre || 'Sin criterio cargado'}</p>
                                            <p className="mt-1 text-xs text-slate-500">ID: {id_criterio || 'Sin selección'}</p>
                                        </div>

                                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-600">Tipo de valor</p>
                                            <p className="mt-2 text-sm font-semibold text-blue-900">{valor_tipo || 'Pendiente de selección'}</p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-600">Estado GLP1</p>
                                            <p className="mt-2 text-sm font-semibold text-emerald-900">
                                                {excluye_glp1 === '1' ? 'Excluyente GLP1' : 'No excluyente GLP1'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap">
                            <ButtonDinamic
                                onClick={() => crearCriterio(nombre, descripcion, valor_tipo, excluye_glp1)}
                                className="bg-slate-900 hover:bg-slate-800"
                            >
                                Guardar criterio
                            </ButtonDinamic>

                            <ButtonDinamic
                                onClick={() => actualizarCriterio(nombre, descripcion, valor_tipo, excluye_glp1, fecha_creacion, id_criterio)}
                                className="bg-blue-700 hover:bg-blue-600"
                            >
                                Actualizar criterio
                            </ButtonDinamic>

                            <ButtonDinamic
                                onClick={() => eliminarCriterio(id_criterio)}
                                className="bg-red-700 hover:bg-red-600"
                            >
                                Eliminar criterio
                            </ButtonDinamic>

                            <ButtonDinamic
                                onClick={limpiarFormulario}
                                className="bg-slate-700 hover:bg-slate-600"
                            >
                                Limpiar formulario
                            </ButtonDinamic>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 space-y-2">
                            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                Búsqueda puntual
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Seleccionar criterio clínico</h2>
                            <p className="text-sm leading-6 text-slate-500">Seleccione un criterio para editar o eliminar sin perder el contexto del formulario.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <SelectDinamic
                                    value={id_criterio}
                                    onChange={(e) => setIdCriterio(e.target.value)}
                                    placeholder="Seleccione un criterio clínico"
                                    options={listaCriteriosClinicos.map((criterio) => ({
                                        value: String(criterio.id_criterio),
                                        label: `${criterio.nombre} - ${criterio.valor_tipo}`
                                    }))}
                                    className="border-slate-200 bg-white"
                                />
                            </div>

                            <ButtonDinamic onClick={() => obtenerPorId(id_criterio)} className="bg-blue-700 hover:bg-blue-600">
                                Seleccionar
                            </ButtonDinamic>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">ID seleccionado</p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">{id_criterio || 'Sin selección actual'}</p>
                            </div>
                            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-600">Vista actual</p>
                                <p className="mt-2 text-sm font-semibold text-blue-900">{nombre || 'Esperando selección'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 space-y-2">
                            <div className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                Filtro dinámico
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Filtrar por tipo de valor</h2>
                            <p className="text-sm leading-6 text-slate-500">Consulta la ruta `obtenercriterios_valor_tipo` para revisar rápidamente grupos de criterios.</p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <SelectDinamic
                                    value={valor_tipo_filtro}
                                    onChange={(e) => setValorTipoFiltro(e.target.value)}
                                    placeholder="Seleccione tipo de valor"
                                    options={[
                                        { value: 'positivo', label: 'Positivo' },
                                        { value: 'negativo', label: 'Negativo' }
                                    ]}
                                    className="border-slate-200 bg-white"
                                />
                            </div>

                            <ButtonDinamic onClick={() => obtenercriterios_valor_tipo(valor_tipo_filtro)} className="bg-blue-700 hover:bg-blue-600">
                                Filtrar
                            </ButtonDinamic>
                        </div>

                        <div className="mt-5 flex min-h-[84px] flex-wrap gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            {listaCriteriosValorTipo.length > 0 ? (
                                listaCriteriosValorTipo.map((criterio) => (
                                    <span
                                        key={criterio.id_criterio}
                                        className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm"
                                    >
                                        {criterio.nombre}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">Aún no hay criterios filtrados por tipo de valor.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    Colección principal
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Criterios activos</h2>
                                <p className="text-sm leading-6 text-slate-500">Listado obtenido desde `obtenerTodosActivos`.</p>
                            </div>

                            <ButtonDinamic
                                onClick={obtenerTodosActivos}
                                className="bg-emerald-700 hover:bg-emerald-600"
                            >
                                Recargar
                            </ButtonDinamic>
                        </div>

                        <div className="space-y-3">
                            {listaCriteriosClinicos.length > 0 ? (
                                listaCriteriosClinicos.map((criterio) => (
                                    <div
                                        key={criterio.id_criterio}
                                        className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-base font-semibold text-slate-900">{criterio.nombre}</p>
                                                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                                        Registro activo
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-6 text-slate-500">{criterio.descripcion}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 sm:max-w-[220px] sm:justify-end">
                                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                                    ID {criterio.id_criterio}
                                                </span>
                                                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                    {criterio.valor_tipo}
                                                </span>
                                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                    GLP1: {Number(criterio.excluye_glp1) === 1 ? 'Sí' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">No hay criterios clínicos activos para mostrar.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                                    Segmento crítico
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Criterios excluyentes GLP1</h2>
                                <p className="text-sm leading-6 text-slate-500">Listado obtenido desde `obtenerExcluyentesGLP1`.</p>
                            </div>

                            <ButtonDinamic
                                onClick={obtenerExcluyentesGLP1}
                                className="bg-emerald-700 hover:bg-emerald-600"
                            >
                                Recargar
                            </ButtonDinamic>
                        </div>

                        <div className="space-y-3">
                            {listaExcluyentesGLP1.length > 0 ? (
                                listaExcluyentesGLP1.map((criterio) => (
                                    <div
                                        key={criterio.id_criterio}
                                        className="rounded-3xl border border-red-100 bg-[linear-gradient(180deg,#fffefe_0%,#fff7f7_100%)] p-5 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-base font-semibold text-slate-900">{criterio.nombre}</p>
                                            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
                                                Alta prioridad
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-500">{criterio.descripcion}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                                                ID {criterio.id_criterio}
                                            </span>
                                            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                                                Excluyente GLP1
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">No hay criterios excluyentes GLP1 disponibles.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
