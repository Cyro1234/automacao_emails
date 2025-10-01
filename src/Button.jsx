function Button({ onClick }) {
    return (
        <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Enviar e Processar
        </button>
    );
}

export default Button;