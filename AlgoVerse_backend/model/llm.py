import os
from langchain_groq import ChatGroq
# from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")

llm = ChatGroq(api_key=GROQ_API_KEY,
               model="moonshotai/kimi-k2-instruct")
                

# llm = ChatOpenAI(
#     api_key=OPEN_ROUTER_API_KEY,
#     base_url="https://openrouter.ai/api/v1",
#     model = "deepseek/deepseek-r1-0528:free"
# )