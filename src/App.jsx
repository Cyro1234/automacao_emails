import { useState } from 'react'
import './App.css'
import Drag from './Drag'
import Button from './Button'
import Emails from './Emails'
import Load from './Load'

function App() {
  const [files, setFiles] = useState([])
  const [resultados, setResultados] = useState([])
  const [isLoading, setIsLoading] = useState(false) // estado de carregamento
  const [error, setError] = useState(null)

  // const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '/api'; // porta 8000 para rodar localmente, /api para quando for deploy
  const API_BASE = import.meta.env.DEV
    ? 'http://localhost:8000'
    : 'https://automacao-emails-back.onrender.com';
  const handleUpload = async () => {
    if (files.length === 0 || isLoading) return;

    setError(null);
    setIsLoading(true);
    setResultados([]);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f)); // chave esperada pelo Flask

      try { await fetch(`${API_BASE}/warm`, { method: 'GET' }); } catch {}

      const resp = await fetch(`${API_BASE}/processar`, {
        method: 'POST',
        body: formData, // NÃO defina Content-Type manualmente
      });

      const raw = await resp.text(); // pode vir HTML/erro vazio

      // log útil no DevTools → Network
      console.log('PROCESSAR status:', resp.status, 'body:', raw?.slice(0, 300));

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} – ${raw?.slice(0, 400) || 'sem corpo'}`);
      }

      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (e) {
        throw new Error(`Resposta não-JSON do servidor: ${raw?.slice(0, 400) || 'vazia'}`);
      }

      setResultados(Array.isArray(data?.resultados) ? data.resultados : []);
    } catch (e) {
      console.error('Falha ao processar:', e);
      setError(String(e));       // <<< isso aparece na UI
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Drag files={files} setFiles={setFiles} />

      {/* Botão só aparece quando houver arquivos */}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={isLoading}
          isLoading={isLoading}
        />

      )}
      {error && (
        <p className="erro" style={{ color: '#ff4d4f', marginTop: 10 }}>
          {error}
        </p>
      )}


      {isLoading && <Load />}

      {!isLoading && <Emails resultados={resultados} />}

      {!isLoading && error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
export default App
