import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv'

dotenv.config();
const GROQ_API_KEY  = process.env.GROQ_API_KEY

const llm = new ChatGroq({
    model : "moonshotai/kimi-k2-instruct",
    temperature : 0,
    apiKey : GROQ_API_KEY
})

const checker  =new ChatGroq({
    model:"llama-3.1-8b-instant",
    temperature:0,
    apiKey:GROQ_API_KEY
})

export { llm, checker}; 