from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer
import os

# configuracoes do Flask
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # permite que o JSON tenha acentos, no caso pro portugues
CORS(app, resources={r"/*": {"origins": "*"}})

# garante que o diretório de upload exista, cria a pasta quando o codigo eh rodado a primeira vez
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # caminho absoluto da pasta onde está esse script
UPLOAD_DIR = os.path.join(BASE_DIR, "emails") # da upload dos arquivos a pasta emails para o processamento dos dados depois
os.makedirs(UPLOAD_DIR, exist_ok=True)

classifier = pipeline("text-classification", model="lilsiru/classificador-emails-ptbr", tokenizer="lilsiru/classificador-emails-ptbr") # classificador baseado no meu modelo gerado e colocado no hugging face, caso queira ver como foi gerado acesse a pasta treino_opcional
tokenizer = AutoTokenizer.from_pretrained("lilsiru/classificador-emails-ptbr")

QA_MODEL = os.getenv("QA_MODEL", "pierreguillou/bert-base-cased-squad-v1.1-portuguese") # garante que o modelo usado seja pt-BR
_qa_pipe = None

def get_qa():
    global _qa_pipe
    if _qa_pipe is None:
        try:
            _qa_pipe = pipeline("question-answering", model=QA_MODEL)
        except Exception:
            _qa_pipe = None
    return _qa_pipe

# leitor de pdf
try:
    import PyPDF2
except Exception:
    PyPDF2 = None

ASSINATURA = os.getenv("ASSINATURA", "Atenciosamente,\nEquipe de Suporte") # agradecimento no final das respostas
AUTO_REPLY_HOURS = os.getenv("AUTO_REPLY_HOURS", "24")

def gerar_resposta(texto: str, categoria: str) -> str:
    cat = (categoria or "").lower()
    if cat.startswith("produt"):  # Produtivo, com base na categoria
        assunto = None
        qa = get_qa()
        if qa:
            try:
                out = qa(
                    question="Qual é a solicitação principal do remetente?", # pergunta ao modelo
                    context=texto[:2000]  # limita contexto
                )
                if isinstance(out, dict):
                    assunto = out.get("answer")
            except Exception:
                assunto = None

        if assunto: 
            return (
                f"Olá! Recebemos sua solicitação sobre \"{assunto}\" e já estamos analisando. "
                f"Retornaremos em até {AUTO_REPLY_HOURS} horas com um posicionamento ou solução. "
                f"Se houver informações adicionais, por favor responda a este email.\n\n{ASSINATURA}"
            )
        else:
            return (
                "Olá! Recebemos sua solicitação e já estamos analisando. "
                f"Retornaremos em até {AUTO_REPLY_HOURS} horas com um posicionamento ou solução. "
                "Se houver informações adicionais, por favor responda a este email.\n\n"
                f"{ASSINATURA}"
            )
    else:  # Improdutivo (ou outro)
        return (
            "Olá! Obrigado pela mensagem. No momento, não identificamos necessidade de ação. "
            "Se precisar de algo, é só responder este email.\n\n"
            f"{ASSINATURA}"
        )

def ler_texto(fs) -> str:
    # le .txt e .pdf, sempre apaga o arquivo salvo da pasta emails
    filename = fs.filename or "sem_nome"
    ext = os.path.splitext(filename)[1].lower()
    path = os.path.join(UPLOAD_DIR, filename)
    fs.save(path)
    try:
        if ext == ".pdf" and PyPDF2 is not None:
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                pages = [(p.extract_text() or "") for p in reader.pages]
                return "\n".join(pages)
        # padrao txt
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    finally:
        try:
            os.remove(path)
        except Exception:
            pass


# processamento dos emails para o endpoint /processar, permite que o back-end se comunique com o front atraves do requerimento http
@app.route('/processar', methods=['POST'])
def processar():
    arquivos = request.files.getlist('files')
    resultados = []
    for fs in arquivos:
        texto = ler_texto(fs)

        # trunca para 512 tokens do seu tokenizer, para evitar erros de tamanho
        tokens = tokenizer.encode(texto, truncation=True, max_length=512)
        texto_truncado = tokenizer.decode(tokens, skip_special_tokens=True)

        out = classifier(texto_truncado)[0]
        categoria = out.get('label', 'Desconhecido')

        resposta = gerar_resposta(texto_truncado, categoria)

        resultados.append({
            'texto': texto,
            'resposta': resposta,
            'categoria': categoria
        })
    return jsonify({'resultados': resultados})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True) # manda para a porta 8000
