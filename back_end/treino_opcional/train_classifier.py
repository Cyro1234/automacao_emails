import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# carrega os dados da planilha
df = pd.read_csv("dataset.csv")
dataset = Dataset.from_pandas(df)

# tokeniza os textos
tokenizer = AutoTokenizer.from_pretrained("xlm-roberta-base")  # usando o modelo roberta base

def tokenize(batch):
    return tokenizer(batch["texto"], padding=True, truncation=True)

dataset = dataset.map(tokenize, batched=True)

# dividir em treino e validação
dataset = dataset.train_test_split(test_size=0.2)
train_dataset = dataset['train']
eval_dataset = dataset['test']

# modelo base para classificação binária
model = AutoModelForSequenceClassification.from_pretrained("xlm-roberta-base", num_labels=2)

# metricas
def compute_metrics(p):
    preds = p.predictions.argmax(axis=1)
    labels = p.label_ids
    acc = accuracy_score(labels, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    return {"accuracy": acc, "precision": precision, "recall": recall, "f1": f1}

# 6. Configurações de treino
training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    logging_dir="./logs",
)

# treinador
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

# treinar
trainer.train()

id2label = {0: "Improdutivo", 1: "Produtivo"}
label2id = {"Improdutivo": 0, "Produtivo": 1}
model.config.id2label = id2label
model.config.label2id  = label2id

# salvar o modelo
model.save_pretrained("./meu_modelo")
tokenizer.save_pretrained("./meu_modelo")
