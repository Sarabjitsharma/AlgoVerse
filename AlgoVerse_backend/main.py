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
    print(code)
    extracted_metadata = extract_metadata(code)
    print(extracted_metadata)
    add_metadata_to_json(extracted_metadata)
    code = clean_output(code) 
    # print("chotu", code)  
    print(time.time()-start)
    return write_react_app_to_file(code,file)

def write_react_app_to_file(code: str, filename: str = 'App.tsx') -> None:
    path = os.path.join('../frontEnd/src/algorithms', filename)
    with open(path, 'w', encoding='utf-8') as file:
        file.write(code)
    # print(f"File '{filename}' has been created successfully.{code}")

import json

def extract_metadata(raw_output: str):
    metadata_match = re.search(r"<metadata>\s*(\{.*?\})\s*</metadata>", raw_output, flags=re.DOTALL)
    if metadata_match:
        metadata_json_str = metadata_match.group(1).strip()
        try:
            metadata = json.loads(metadata_json_str)
            return metadata
        except json.JSONDecodeError:
            print("Error: Could not parse metadata JSON.")
            return None
    else:
        return None


def add_metadata_to_json(metadata: dict, json_path: str = '../frontEnd/src/data/algoirthms.json') -> bool:
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Ensure articles key exists
        if "articles" not in data:
            data["articles"] = []

        data["articles"].append(metadata)

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        return True
    except Exception as e:
        print(f"Error updating JSON file: {e}")
        return False


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
    