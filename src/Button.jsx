function Button({ onClick, disabled, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-busy={isLoading}
      aria-disabled={disabled}
      className={`${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
      } bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4`}
      title={isLoading ? 'Processando...' : 'Enviar e Processar'}
    >
      {isLoading ? 'Processando...' : 'Enviar e Processar'} 
    </button>
  )
}
export default Button
