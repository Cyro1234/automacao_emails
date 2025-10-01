import TxtIcon from './assets/txt.svg?react';
import PdfIcon from './assets/pdf.svg?react';
import './Card.css'


function Card({ nome }) {

    const tamanhoIcon = 20;
    return (
        <div className='card container mx-auto my-2 border border-solid rounded-xl flex flex-wrap bg-white'>
            <article className='m-auto'>
                {
                    nome && nome.endsWith('.txt') ? ( // verifica se o nome do arquivo termina com .txt ou .pdf, para mostrar o icone correto
                        <div className='flex justify-center items-center mb-4'>
                            <TxtIcon className={`w-${tamanhoIcon} text-blue-500`} />
                        </div>
                    ) : (
                        <div className='flex justify-center items-center mb-4'>
                            <PdfIcon className={`w-${tamanhoIcon} text-red-500`} />
                        </div>
                    )
                }
                {
                    nome ? <h1 className='text-center underline text-black line-clamp-1'>{nome}</h1> : <h1 className='text-center underline'>Nome do Arquivo</h1> // se nao tiver nome, mostra "Nome do Arquivo"   
                }
            </article>
        </div>
    )
}

export default Card