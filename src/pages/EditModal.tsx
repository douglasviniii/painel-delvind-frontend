import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useParams } from 'react-router-dom'; 
import EditReport from './EditModal'; 

interface EditModalProps {
    initialData: { title: string; description: string; _id: string }; 
    onClose: () => void;
    onUpdate: () => void;
}

const EndPointAPI = import.meta.env.VITE_END_POINT_API;
// const EndPointAPI = 'http://localhost:3000';

const EditModal: React.FC<EditModalProps> = ({
    
    initialData,
    onClose,
    onUpdate,
}) => {
    const { id } = useParams();
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
        }
    }, [initialData]);

    const handleUpdate = async (id: string) => {
        setLoading(true);
        setError("");

        if (!initialData || !initialData._id) {
            setError("Erro: ID do relatório não encontrado.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `${EndPointAPI}/reportemployee/update/${initialData._id}`,
                { title, description },
                { headers: { Authorization: `Bearer ${Cookie.get("token")}` } }
            );

            
            onUpdate();
            onClose();
        } catch (err) {
            
            setError("Erro ao atualizar o relatório.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Editar Relatório</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título"
                    className="w-full p-2 border rounded-md mb-4"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                    className="w-full p-2 border rounded-md mb-4"
                />
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => handleUpdate(initialData._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;