import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell,Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import Cookie from 'js-cookie';

const EndPointAPI = import.meta.env.VITE_END_POINT_API;

const Alerts: React.FC = () => {

  const navigate = useNavigate();
  
  const [userAlerts, setUserAlerts] = useState([]);

  const handledelete = async (id: string) => {
    try {
      await axios.delete(`${EndPointAPI}/notifications/delete/${id}`);
      alert("Notificação excluída com sucesso!");
    } catch (error) {
      console.error("Ocorreu um erro ao excluir a notificação:",error);
    } 
  };

  useEffect(()=>{
    async function FindAlerts() {
      const response = await axios.get(`${EndPointAPI}/notifications/find`,{
        headers:{
           Authorization: `Bearer ${Cookie.get('token')}`,
        }
      })
      setUserAlerts(response.data);
    }
    FindAlerts();
  },[])

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Notificações</h1>
      </div>
      
      {userAlerts.length === 0 ? (
        <div className="card text-center py-12">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma notificação</h2>
          <p className="text-gray-600">Você não possui notificações no momento</p>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            {userAlerts.map(alert => (
              <div 
                key={alert._id} 
                className={`p-4 rounded-md border ${
                  alert.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Bell size={20} className={`mr-3 mt-1 ${alert.read ? 'text-gray-400' : 'text-primary'}`} />
                    <div>
                      <p className={`${alert.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.date).toLocaleDateString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                    <button 
                      onClick={() => handledelete(alert._id)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <Trash2Icon size={18} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Alerts;