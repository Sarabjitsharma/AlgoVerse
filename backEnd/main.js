import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import Prompt from './utils/prompt.js';
import llm from './model/llm.js';
import helpers from './utils/helpers.js';
import User from './models/User.js';
import serverless from 'serverless-http';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import CodeModel from './models/CodeModel.js';


const app = express();
app.use(express.json());
app.use(cors({
    origin: ["*", "http://localhost:5173"],
    credentials: true
}));

connectDB();

// ✅ POST route to upload JSX
app.post('/upload-jsx', async (req, res) => {
    try {
        const { name, jsx } = req.body;

        if (!name || !jsx) {
            return res.status(400).json({ error: 'Name and JSX are required' });
        }

        const doc = new CodeModel({ name, jsx });
        await doc.save();

        res.json({ success: true, id: doc._id });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/get-jsx/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await CodeModel.findById(id);

        if (!doc) {
            return res.status(404).json({ error: "Not found" });
        }

        res.json({ name: doc.name, jsx: doc.jsx });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// app.get('/add-test-user', async (req, res) => {
//   try {
//     const user = await User.create({ clerkId: 'test123', name: 'Test User', email: 'test@example.com' });
//     console.log('Test user added:', user);
//     res.json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// mongoose.connection.on('connected', () => {
//   console.log('MongoDB is connected!');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });


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

        const doc = new CodeModel({
            name: Algo_name,
            jsx: cleanedCode,
            metadata: metadata
        });

        await doc.save();

        // const fileName = `${Algo_name}.jsx`;
        // const filePath = path.join(process.cwd(), '../frontEnd/src/algorithms', fileName);
        // fs.writeFileSync(filePath, cleanedCode, 'utf-8');

        res.json({ success: true, id: doc._id, metadata: metadata });
    } catch (err) {
        console.error('Error in /make endpoint:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// export const handler = serverless(app);
export default app;