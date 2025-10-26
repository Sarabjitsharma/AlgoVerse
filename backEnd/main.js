import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import Prompt from './utils/prompt.js';
import llm from './model/llm.js';
import helpers from './utils/helpers.js';

const app = express();

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("This is the backend server of Algoverse");
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

async function invokeLLM(promptTemplate, input) {

    const formattedPrompt = await promptTemplate.format(input);

    const response = await llm.invoke(formattedPrompt);
    return response.content; 
}

app.post('/make', async (req, res) => {
    try {
        const { Algo_name } = req.body;
        if (!Algo_name) return res.status(400).send("Algo_name is required");

        const input = { algorithm: Algo_name };
        const code = await invokeLLM(Prompt, input);

        const metadata = helpers.extractMetadata(code);

        await helpers.addMetadataToJson(metadata);

        const cleanedCode = helpers.cleanOutput(code);

        const fileName = `${Algo_name}.jsx`;
        const filePath = path.join(process.cwd(), '../frontEnd/src/algorithms', fileName);
        fs.writeFileSync(filePath, cleanedCode, 'utf-8');

        res.json({ success: true, metadata,filePath });
    } catch (err) {
        console.error('Error in /make endpoint:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});