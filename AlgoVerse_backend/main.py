from fastapi import FastAPI
import re
import time
from pydantic import BaseModel
import langchain
from model import llm
import os
from utils import Prompt
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AlgoMaker(BaseModel):
    Algo_name :str

@app.get("/")
def home():
    return "hehe"

@app.post("/make")
def make_algo(req:AlgoMaker):
    start= time.time()
    query = req.Algo_name
    
    input = {"algorithm":query}
    chain = Prompt | llm
    code = chain.invoke(input).content
    file = query+".jsx"
    code = clean_output(code)   
    print(time.time()-start)
    return write_react_app_to_file(code,file)

def write_react_app_to_file(code: str, filename: str = 'App.tsx') -> None:
    path = os.path.join('../frontEnd/src/algorithms', filename)
    with open(path, 'w', encoding='utf-8') as file:
        file.write(code)
    # print(f"File '{filename}' has been created successfully.{code}")n    


def clean_output(answer):
    content = str(answer).strip()
    content = re.sub(r"<explanation>.*?</explanation>", "", content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r"<dependencies(-file)?>.*?</dependencies(-file)?>", "", content, flags=re.DOTALL | re.IGNORECASE)

    match = re.search(r"<code-file[^>]*>(.*?)</code-file>", content, re.DOTALL)
    if match:
        extracted = match.group(1).strip()
    else:
        extracted = "" 

    cleaned = re.sub(r"\n{3,}", "\n\n", extracted)
    return cleaned
    