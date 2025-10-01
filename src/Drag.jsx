import { useState } from 'react'
import './Drag.css'
import Card from './Card'
import FileIcon from './assets/files.svg?react'

function Drag({ files, setFiles }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [inputText, setInputText] = useState('')
  const [inputSeq, setInputSeq] = useState(0) // contador so dos arquivos criados via input

  const addInputAsFile = () => {
    const text = inputText.trim()
    if (!text) return

    const next = inputSeq + 1
    const fileName = `input${next}.txt`

    // Blob/File com UTF-8 para preservar caracteres especiais
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const file = new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    })

    setFiles(prev => [...prev, file])
    setInputSeq(next)
    setInputText('')
  }

  const dragEvents = { // eventos de drag and drop
    onDragEnter: (e) => {
      e.preventDefault()
      setIsDragOver(true)
    },
    onDragLeave: (e) => {
      e.preventDefault()
      setIsDragOver(false)
    },
    onDragOver: (e) => {
      e.preventDefault()
      setIsDragOver(true)
    },
    onDrop: (e) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = Array
        .from(e.dataTransfer.files)
        .filter(file => {
          const name = file.name.toLowerCase()
          return name.endsWith('.txt') || name.endsWith('.pdf')
        })

      setFiles(prev => [...prev, ...droppedFiles])
    },
  }

  const hoverEvents = { // padrao so pra mudar a cor quando passa o mouse sem estar arrastando um arquivo
    onMouseEnter: (e) => e.preventDefault(),
    onMouseLeave: (e) => e.preventDefault(),
  }

  return (
    <div>
      <div className='drag container mx-auto border-2 border-solid rounded-xl flex flex-col items-center justify-center p-4 mt-4 bg-indigo-500 shadow-md shadow-black'>
        <div
          className={`drop-scroll flex flex-wrap w-full max-w-xl h-72 items-center justify-center overflow-y-auto border-2 border-dashed rounded-xl hover:bg-indigo-600 ${isDragOver ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`} // muda a cor quando arrasta um arquivo
          style={{ minHeight: 200 }}
          {...dragEvents} // eventos de drag and drop
          {...hoverEvents} // eventos de hover
        >
          {files.length > 0 ? ( // mostra os arquivos arrastados ou adicionados via input, caso nao tenha arquivos, indica que arraste os arquivos
            files.map((file, i) => <Card nome={file.name} key={file.name + i} />)
          ) : (
            <div>
              <FileIcon className="w-16 h-16 text-white mx-auto mb-4" />
              <h1 className="text-center w-full text-xl font-bold">
                Arraste os documentos em formato .txt ou .pdf
              </h1>
            </div>
          )}
        </div>
      </div>

      <p className='m-5'>Ou...</p>

      <div className='m-5 flex gap-2 items-start'>
        <input type="text" className="bg-white p-2 rounded text-black flex-1" placeholder="Insira o texto" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') { // adiciona o texto como arquivo ao pressionar Enter
              e.preventDefault()
              addInputAsFile()
            }
          }}
          aria-label="Texto para gerar .txt"
        /> {/* tambem e possivel adicionar clicando no botao */}
        <button type="button" onClick={addInputAsFile} className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" title="Adicionar como .txt"> 
          Adicionar como .txt
        </button>
      </div>
    </div>
  )
}

export default Drag
