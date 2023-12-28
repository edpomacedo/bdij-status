import './App.css';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';

function App() {
  const [serviceStatus, setServiceStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const checkServiceStatus = async (url, serviceName) => {
    try {
      const response = await fetch(url);
      const status = response.status === 200 ? 'Operacional' : 'Indisponível';
      setServiceStatus(prevStatus => ({ ...prevStatus, [serviceName]: status }));
    } catch (error) {
      setServiceStatus(prevStatus => ({ ...prevStatus, [serviceName]: 'Erro ao verificar o status' }));
    }
  };

  useEffect(() => {
    // Função para verificar o status dos serviços
    const checkStatus = async () => {
      setLoading(true);

      // Verificar o status inicial
      await checkServiceStatus('https://api.bdij.com.br', 'API');
      await checkServiceStatus('https://web.bdij.com.br/w/rest.php/v1/page/Main_Page', 'REST');
      await checkServiceStatus('https://web.bdij.com.br/query/sparql', 'SPARQL');
      // Adicione mais serviços conforme necessário

      setLoading(false);
    };

    // Executar a verificação inicial
    checkStatus();

    // Configurar verificação a cada minuto
    const intervalId = setInterval(() => {
      checkStatus();
    }, 60000); // 60000 milissegundos = 1 minuto

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []); // O segundo parâmetro [] garante que o useEffect só é executado uma vez no montar do componente

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Status dos Serviços</h1>

      {/* Renderizar a mensagem de "Aguardando" ou o spinner durante o carregamento */}
      {loading && <div>Aguardando...</div>}

      {/* Renderizar o status dos serviços após o carregamento */}
      {!loading && Object.entries(serviceStatus).map(([serviceName, status]) => (
        <div key={serviceName} className={`service-status ${status === 'Operacional' ? 'service-operational' : 'service-down'}`}>
          {serviceName}: {status}
        </div>
      ))}
    </div>
  );
}

export default App;
