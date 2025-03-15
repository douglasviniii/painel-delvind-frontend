import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const CreateReport: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      [{ 'table': true }]
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validateForm = () => {
      if (!title.trim() || !content.trim()) {
        alert('Por favor, preencha todos os campos');
        return false;
      }
      return true;
    };
  
    if (!validateForm()) return;
  
    const storedUsers = localStorage.getItem("data");
    const user = storedUsers ? JSON.parse(storedUsers) : null;
  
    if (!user) {
      alert('Usuário não encontrado!');
      return;
    }
  
    const reportData = { title, content };
    const headers = { Authorization: `Bearer ${Cookie.get('token')}` };
    const endpoint = user.role === 'admin' 
      ? `${EndPointAPI}/reportadmin/create` 
      : `${EndPointAPI}/reportemployee/create`;
  
    try {
      await axios.post(endpoint, reportData, { headers });
      alert('Relatório criado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao criar o relatório:', error);
      alert("Ocorreu um erro ao criar o relatório!");
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Criar Novo Relatório</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Título do Relatório
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Conteúdo
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="bg-white"
          />
          <p className="text-sm text-gray-500 mt-2">
            Use as ferramentas acima para formatar seu texto e adicionar tabelas.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <Save size={20} className="mr-2" />
            Salvar Relatório
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateReport;