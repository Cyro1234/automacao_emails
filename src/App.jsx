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

  const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '/api'; // porta 8000 para rodar localmente, /api para quando for deploy

  const handleUpload = async () => {
  if (files.length === 0 || isLoading) return
  setError(null)
  setIsLoading(true)
  setResultados([])

  try {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file)) // chave esperada no Flask

    const resp = await fetch(`${API_BASE}/processar`, {
      method: 'POST',
      body: formData,
    })

    // Leia como texto primeiro (quando dá erro o servidor pode mandar HTML ou corpo vazio)
    const raw = await resp.text()

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} – ${raw?.slice(0, 400) || 'sem corpo'}`)
    }

    let data
    try {
      data = raw ? JSON.parse(raw) : null
    } catch (e) {
      throw new Error(`Resposta não-JSON do servidor: ${raw?.slice(0, 400) || 'vazia'}`)
    }

    setResultados(Array.isArray(data?.resultados) ? data.resultados : [])
  } catch (e) {
    console.error(e)
    setError(String(e))
  } finally {
    setIsLoading(false)
  }
}

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

      {isLoading && <Load />}

      {!isLoading && <Emails resultados={resultados} />}

      {!isLoading && error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}
export default App
