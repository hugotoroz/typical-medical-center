import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../../components/sidebar/sidebar.jsx';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // Importa el CSS para el estilo de Quill
import { API_URL } from '../../../../config.js';
import { Document, Page, Text, StyleSheet, PDFDownloadLink, View, pdf  } from '@react-pdf/renderer'; 
import Editor from '../../../components/editor/Editor.jsx';
import Quill from 'quill';
import './diagnosis.css';

const Delta = Quill.import('delta');

const Diagnosis = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false); // Nuevo estado para el segundo modal
    const [error, setError] = useState(null);
    const [documentTypes, setDocumentTypes] = useState([]);
    const quillRef = useRef();
    const quillRef2 = useRef();
    const [htmlContent, setHtmlContent] = useState('');

    const toggleModal = () => setIsOpen(!isOpen);
    const toggleSecondModal = () => setIsSecondModalOpen(!isSecondModalOpen); // Función para alternar el segundo modal


    const token = sessionStorage.getItem('token');

    useEffect(() => {
        // JSON de los tipos de documentos
        const jsonData = {
            "tipos_documento": [
                { "id": 1, "nom": "Receta Médica" },
                { "id": 2, "nom": "Orden de exámenes" },
                { "id": 3, "nom": "Indicaciones" },
                { "id": 4, "nom": "Certificado Médico" },
                { "id": 5, "nom": "Consentimiento Informado" },
                { "id": 6, "nom": "Reporte de Alta" },
                { "id": 7, "nom": "Órdenes de referencia (Derivación)" }
            ]
        };

        // Actualizamos el estado con los datos simulados
        setDocumentTypes(jsonData.tipos_documento);
    }, []);

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

    return (
        <>
            <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
                <Sidebar />

                <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
                    <h2 className="text-2xl font-semibold mb-6">Diagnóstico</h2> {/* Alineación a la izquierda */}

                    {/* Botón para abrir el segundo modal */}
                    <button
                        onClick={toggleSecondModal}
                        className="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 "
                    >
                        Abrir Segundo Modal
                    </button>

                    {/* Nuevo editor fuera del modal */}
                    <div className="mt-6">
                        <label className="text-lg font-medium block mb-2 text-left">Anamnesis:</label>
                        <Editor
                        ref={quillRef}
                        />
                    </div>

                    <button
                        onClick={toggleModal}
                        className="relative group text-teal-600 hover:text-teal-800 mt-16"
                    >
                        {/* Icono (puedes usar Font Awesome, Heroicons, o SVG) */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 0L7.5 8.25m-3.75 3.75L7.5 15.75M16.5 8.25h4.5M21 8.25L16.5 4.5M16.5 8.25l4.5 3.75" />
                        </svg>
                        {/* Tooltip al pasar el ratón */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-32 bg-gray-700 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Ver diagnóstico
                        </span>
                    </button>

                    
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

                            <button
                                onClick={getEditorContent}
                                className="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 mt-8"
                            >
                                Generar Pdf
                            </button>

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
            </div>
        </>
    );
};

export default Diagnosis;
