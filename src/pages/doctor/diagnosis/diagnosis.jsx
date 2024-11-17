import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Sidebar } from '../../../components/sidebar/sidebar.jsx';
import axios from 'axios';
import { API_URL } from '../../../../config.js';
import { Document, Page, Text, StyleSheet, PDFDownloadLink, View, pdf  } from '@react-pdf/renderer'; 
import Editor from '../../../components/editor/Editor.jsx';
import 'quill/dist/quill.snow.css'; // Tema "snow"
import 'quill/dist/quill.bubble.css';
import Quill from 'quill';
import './diagnosis.css';
import Swal from 'sweetalert2';
import pdf_image from '../../../images/doctor/pdf_image.png';
import OnClickButton from '../../../components/button/onClickButton.jsx';
import { Tooltip as ReactTooltip } from 'react-tooltip'

const Delta = Quill.import('delta');

const Diagnosis = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [ModalHistorial, setModalHistorial] = useState(false);
    const [ModalObservacion, setModalObservacion] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false); // Nuevo estado para el segundo modal
    const [error, setError] = useState(null);
    const [documentTypes, setDocumentTypes] = useState([]);
    const quillRef = useRef();
    const quillRef2 = useRef();
    const [htmlContent, setHtmlContent] = useState('');
    const [idCita, setIdCita] = useState(null);
    const [idPaciente, setIdPaciente] = useState(null);
    const [cita, setCita] = useState(null);

    const location = useLocation();

    const toggleModal = () => setIsOpen(!isOpen);

    const abrirModalHistorial = () => setModalHistorial(!ModalHistorial); // Función para alternar el segundo modal
    const [historial, setHistorial] = useState([]);

    const [observacionActiva, setObservacionActiva] = useState('');
    const [fechaActiva, setFechaActiva] = useState('');
    
    const abrirModalObservacion = (observacion,fecha) => {
        setObservacionActiva(observacion); // Configurar la observación activa
        setFechaActiva(fecha);
        setModalObservacion(true); // Abrir el modal
    };

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        // Recuperar el valor almacenado en localStorage
        const storedIdCita = localStorage.getItem("idCita");
        const storedIdPaciente = localStorage.getItem("idPaciente");
        if (storedIdCita && storedIdPaciente) {
            setIdCita(storedIdCita);
            setIdPaciente(storedIdPaciente);
        }
    
    }, []);

    //eliminar localstorage al salir de la pagina
    
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Solo eliminar el item si no es una recarga
            if (!sessionStorage.getItem("reloaded")) {
                localStorage.removeItem("idCita");
            }
        };

        // Si el componente se recarga, marcarlo en sessionStorage
        sessionStorage.setItem("reloaded", "true");

        // Escuchar el evento beforeunload
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Limpiar el evento cuando el componente se desmonte
            window.removeEventListener('beforeunload', handleBeforeUnload);

            // También puedes hacer la limpieza cuando cambie la ruta (opcional)
            if (location.pathname !== "/doctor/diagnosis") {
                localStorage.removeItem("idCita");
            }

            // Limpiar el valor de sessionStorage después de la descarga de la página
            sessionStorage.removeItem("reloaded");
        };
    }, [location]);

    useEffect(() => {
        if (idCita) {
            console.log("Id de la cita:", idCita);
            console.log("Id de el paciente:", idPaciente);
        }
    }, [idCita]);

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                // Aquí llamamos a la API
                const response = await axios.get(`${API_URL}/documents/types`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Enviar el token en los headers
                    }
                });

                // Log de la respuesta para inspección
                console.log('API response:', response.data);

                // Asumiendo que el formato de la respuesta es como el JSON original
                const data = response.data.data;

                // Actualizamos el estado con los datos obtenidos
                setDocumentTypes(data); // Suponiendo que la respuesta tenga el mismo formato
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Llamamos a la función fetchDocumentTypes
        fetchDocumentTypes();
    }, []); // El efecto se ejecuta solo una vez cuando el componente se monta

    const getEditorContent = async () => {
        // Obtener el contenido del editor
        const content = quillRef2.current?.root.innerHTML;
        setHtmlContent(content);

        console.log(content);

        // Crear el documento PDF
        const pdfDoc = (
            <Document>
                <Page style={{ padding: 20 }}>
                    <View>
                        {renderHTMLToPDF(content)}
                    </View>
                </Page>
            </Document>
        );

        // Generar el PDF y obtener el blob
        const pdfBlob = await pdf(pdfDoc).toBlob();

        // Crear enlace de descarga y activarlo
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'diagnosis.pdf';
        link.click();
    };


      

    const renderHTMLToPDF = (htmlContent) => {

        

        const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    
        console.log("Contenido para el PDF:", htmlContent);
    
        const elements = [];
    
        // Agregar el título "Diagnóstico" por defecto
        elements.push(
            <Text key="title" style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                Diagnóstico
            </Text>
        );
    
        // Función para procesar texto con etiquetas de formato (negrita, cursiva)
        const processText = (node) => {
            let textParts = [];
            
            node.childNodes.forEach((childNode, index) => {
                if (childNode.nodeName === 'B' || childNode.nodeName === 'STRONG') {
                    textParts.push(<Text key={`bold-${index}`} style={{ fontWeight: 'bold' }}>{childNode.textContent}</Text>);
                } else if (childNode.nodeName === 'I' || childNode.nodeName === 'EM') {
                    textParts.push(<Text key={`italic-${index}`} style={{ fontStyle: 'italic' }}>{childNode.textContent}</Text>);
                } else if (childNode.nodeName === '#text') {
                    textParts.push(childNode.textContent);
                }
            });
    
            return textParts;
        };
    
        // Recorrer todos los nodos del HTML para mantener el orden
        const childNodes = doc.body.childNodes;
    
        childNodes.forEach((node, index) => {
            if (node.nodeName === 'OL') {
                // Si encontramos una lista ordenada (ol), recorrer sus elementos
                node.querySelectorAll('li').forEach((li, liIndex) => {
                    elements.push(
                        <Text key={`ol-${index}-${liIndex}`} style={{ marginBottom: 5 }}>
                            {liIndex + 1}. {processText(li)}
                        </Text>
                    );
                });
            } else if (node.nodeName === 'UL') {
                // Si encontramos una lista no ordenada (ul), recorrer sus elementos
                node.querySelectorAll('li').forEach((li, liIndex) => {
                    elements.push(
                        <Text key={`ul-${index}-${liIndex}`} style={{ marginBottom: 5 }}>
                            • {processText(li)}
                        </Text>
                    );
                });
            } else if (node.nodeName === 'P') {
                // Si encontramos un párrafo (p), agregarlo como texto
                elements.push(
                    <Text key={`p-${index}`} style={{ marginBottom: 10 }}>
                        {processText(node)}
                    </Text>
                );
            }
        });
    
        return elements;
    };
    

    // Definir el estilo para el PDF
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 30,
        },
        section: {
            marginBottom: 10,
        },
        text: {
            fontSize: 12,
            textAlign: 'justify',
        },
    });

    //Diagnostico

    const guardarDiagnostico = () => {
        console.log('Botón clickeado');  // Asegúrate de que esto se imprima en la consola
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres guardar el diagnóstico?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const content = quillRef.current?.root.innerHTML;

                const diagnosisData = {
                    observation: content,  // El contenido HTML de Quill
                    idCita: idCita,        // El ID de la cita
                };

                console.log(diagnosisData);
                console.log('El diagnóstico ha sido guardado');  // Verifica si esto se imprime
                Swal.fire('Guardado!', 'El diagnóstico ha sido guardado.', 'success');
            }
        });
    };

    //Historial medico

    useEffect(() => {
        // Obtén el idCita desde el localStorage
        const idPaciente = localStorage.getItem("idPaciente");
        
        //const token = sessionStorage.getItem("token");

        console.log(token);

        console.log(idPaciente);

        if (idPaciente) {

          // Haz la petición al backend
          axios
            .get(`${API_URL}/patients/${idPaciente}/observations`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response.data);
                setHistorial(response.data);
            })
            
        } else {
          console.log("No se encontró un ID de cita en el localStorage.");
        }
      }, []); // Solo se ejecuta al montar el componente


    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
                <Sidebar />

                <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
                    <h2 className="text-2xl font-semibold mb-6">Diagnóstico</h2> {/* Alineación a la izquierda */}

                    {/* Botón para abrir el segundo modal */}
                    <OnClickButton text="Ver Historial Del Paciente" func={abrirModalHistorial} />

                    {/* Nuevo editor fuera del modal */}
                    <div className="mt-6">
                        <label className="text-lg   font-medium block mb-2 text-left">Anamnesis:</label>
                        <Editor
                        ref={quillRef}
                        style={{ height: 'auto' }}
                        />
                    </div>

                    <div className="modal-footer flex justify-center space-x-4 mt-4">
                        <OnClickButton text="Guardar Diagnostico" func={guardarDiagnostico} />
                        <OnClickButton text="Crear Documento" func={toggleModal} />
                    </div>

                    
                </div>

                {/* Primer Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
                            <h2 className="text-2xl font-semibold mb-4 text-left">Diagnóstico</h2>

                            {/* Editor de texto Quill en el modal */}
                            <div className="mb-6">
                                <label className="text-lg font-medium block mb-2 text-left">Escribe el diagnóstico:</label>
                                

                                <Editor
                                ref={quillRef2}
                                style={{ height: '200px' }}
                                />

                                
                            </div>

                            {/* Lista de Tipos de Documento */}
                            <div className="mb-6">
                                <label className="text-lg font-medium block mb-2 text-left">Tipos de Documento:</label>
                                <select className="w-full p-2 border rounded-md">
                                    {documentTypes.map((docType) => (
                                        <option key={docType.id} value={docType.id}>
                                            {docType.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <OnClickButton text="Generar Pdf" func={getEditorContent} />

                            {error && <p className="text-red-500 mt-4">{error}</p>}

                            {/* Botón para cerrar el modal */}
                            <button
                                onClick={toggleModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Modal historial */}

                {ModalHistorial && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
                            <h2 className="text-2xl font-semibold mb-4 text-left">Historial medico de </h2>

                            {error && <p className="text-red-500 mt-4">{error}</p>}

                            <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha</th>
                                        <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Observación</th>
                                        <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Documentos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(item.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {/*item.observacion*/}
                                                <OnClickButton 
                                                    text="Ver Observación" 
                                                    func={() => abrirModalObservacion(item.observacion,item.fecha)} 
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {item.documents.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.documents.map((doc, i) => (
                                                            <a
                                                                key={i}
                                                                href={doc.src}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-white p-1 rounded"
                                                                data-tooltip-id={`tooltip-${i}`} // Asocia un ID único para cada tooltip
                                                                data-tooltip-content={doc.tipo_documento || "Documento"} // Contenido del tooltip
                                                            >
                                                                <img
                                                                    src={pdf_image}
                                                                    alt={doc.tipo_documento || "Documento"}
                                                                    className="w-8 h-8 object-cover"
                                                                />
                                                            </a>
                                                        ))}
                                                        {/* Renderiza los tooltips */}
                                                        {item.documents.map((_, i) => (
                                                            <ReactTooltip key={`tooltip-${i}`} id={`tooltip-${i}`} place="top" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "Sin documentos"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Botón para cerrar el modal */}
                            <button
                                onClick={abrirModalHistorial}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Observacion */}
                {ModalObservacion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
                            <h2 className="text-2xl font-semibold mb-4 text-left">Observacion - {new Date(fechaActiva).toLocaleDateString()}</h2>

                            

                            {/* Editor de texto Quill en el modal */}
                            <div className="mb-6">
                                <textarea
                                    className="w-full p-4 border rounded-lg bg-gray-100 text-gray-700 resize-none"
                                    value={observacionActiva || "Sin observación disponible"}
                                    readOnly
                                    rows={12} // Establece el número de filas visibles
                                    style={{ height: 'auto', Height: '100px' }} // Limita la altura
                                />
                            </div>

                            {/* Botón para cerrar el modal */}
                            <button
                                onClick={() => setModalObservacion(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Diagnosis;
