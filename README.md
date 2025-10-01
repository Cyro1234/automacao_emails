# 📧 Automação de E-mails com IA

Projeto fullstack (React + Flask) que realiza **classificação de e-mails em Português** e gera respostas automáticas utilizando **modelos pré-treinados de NLP (Hugging Face Transformers)**.  

O objetivo é auxiliar equipes de suporte a **identificar rapidamente mensagens produtivas e improdutivas** e responder de forma eficiente.

---

## ⚙️ Tecnologias Utilizadas

- **Frontend:** React + Vite + Tailwind
- **Backend:** Python + Flask + Flask-CORS
- **IA / NLP:** Hugging Face Transformers
- **Gerenciador de Pacotes:** npm / pip
- **Ambiente Virtual:** venv (Python)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/en/download/)

---

## 🚀 Instruções de Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/Cyro1234/automacao_emails.git
```

### 2. Acesse a pasta do projeto
```bash
cd seu-repositorio
```

### 3. Instale as dependências do frontend
```bash
npm install
```

### 4. Configure o ambiente virtual do Python (recomendado)

#### Linux / Mac
```bash
cd backend
python -m venv venv
source venv/bin/activate
```
#### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### 5. Instale as dependências do backend
```bash
pip install -r requirements_py.txt
```
### 5.1. (Opcional) Dependências para treino do modelo
```bash
pip install -r requirements_train.txt
```

### 6. Inicie o backend (Flask)
```bash
python main.py
```

### 7. Volte para a pasta raiz e inicie o frontend
```bash
cd ..
npm run dev
```
O frontend estará rodando em:
👉 http://localhost:5173

E o backend em:
👉 http://localhost:8000

---

## 🚀 (Opcional) Instruções de treinamento
Caso queira ver como o modelo Hugging Face foi criado (OBS.: Esse passo requer instalação das dependências do arquivo requirementes_train.txt):

### 1. Configure o ambiente virtual do Python, caso tenha fechado (recomendado)

#### Linux / Mac
```bash
cd backend
python -m venv venv
source venv/bin/activate
```
#### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### 2. Inicie o arquivo de treinamento
```bash
python train_classifier.py
```

---

## 🌐 Deploy

Este projeto foi configurado para deploy na plataforma Render:

Backend em Flask com gunicorn

Frontend em React (static site)

Redirecionamento de /api/* → backend

Link: https://automacao-emails-s397.onrender.com/
