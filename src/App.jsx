import { useState } from 'react'
import './App.css'
import Drag from './Drag'
import Button from './Button'
import Emails from './Emails'

function App() {
  const [files, setFiles] = useState([]);
  const [resultados, setResultados] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch('http://localhost:8000/processar', { // ajustar a porta para 8000, envia o conteudo para o endpoint correto
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setResultados(data.resultados || []);
  };

  return (
    <div>
      <Drag files={files} setFiles={setFiles} />
      <Button onClick={handleUpload} />
      <Emails resultados={resultados} />
    </div>
  );
}

export default App
