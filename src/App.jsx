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

  const handleUpload = async () => {
    if (files.length === 0 || isLoading) return
    setError(null)
    setIsLoading(true)
    setResultados([])

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const resp = await fetch('http://localhost:8000/processar', { // ajustar a porta para 8000, envia o conteudo para o endpoint correto
        method: 'POST',
        body: formData
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setResultados(data.resultados || [])
    } catch (e) {
      console.error(e)
      setError('Falha ao processar. Tente novamente.')
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
