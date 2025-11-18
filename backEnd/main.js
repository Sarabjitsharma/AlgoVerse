import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Prompt, CheckerPrompt } from './utils/prompt.js';
import llm from './model/llm.js';
import helpers from './utils/helpers.js';
import User from './models/User.js';
import serverless from 'serverless-http';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import Algorithms from './models/Algorithm.js';
import crypto from 'crypto'
import { ObjectId } from 'mongodb'

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["*", "http://localhost:5173", "https://algo-verse-jade.vercel.app"],
  credentials: true
}));

connectDB();


// app.get('/add-test-user', async (req, res) => {
//   try {
//     const user = await User.create({ clerkId: "user_350Cs6ZWN42Oa2yW4i9e9kpAv2h", name: 'unknown', Algo_id: [] });
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

async function invokeLLM(promptTemplate, input, llm) {

  const formattedPrompt = await promptTemplate.format(input);

  const response = await llm.invoke(formattedPrompt);
  return response.content;
}

app.post('/make', async (req, res) => {
  try {
    const { Algo_name, userID } = req.body;

    const algoDocs = await Algorithms.find().select("_id title description slug ");
    const created_algo = algoDocs
      .map(a => `ID:${a._id} | TITLE:${a.title} | DESC:${a.description} | SLUG:${a.slug}`)
      .join("\n");

    const check_input = {
      algorithm_name: Algo_name,
      mongodb_stored_algos: created_algo
    };
    const val = await invokeLLM(CheckerPrompt, check_input, llm);
    console.log(val)
    if (val.toUpperCase() != 'NEW') {
      const id = val.match(/FOUND:(.+)/)?.[1]?.trim();
      const update_algo_to_user = await User.findOneAndUpdate(
        { clerkId: userID },
        { $addToSet: { Algo_id: id } },
        { new: true }
      );

      const metadata = await Algorithms.findById(id);
      res.json({ success: true, id: id, metadata, user: update_algo_to_user });
    }

    if (!Algo_name) return res.status(400).send("Algo_name is required");
    if (!userID) return res.status(400).send("userID is required");

    const input = { algorithm: Algo_name };
    const code = await invokeLLM(Prompt, input, llm);

    const metadata = helpers.extractMetadata(code);
    // await helpers.addMetadataToJson(metadata);
    const cleanedCode = helpers.cleanOutput(code);

    // Save the new Algorithm
    const doc = new Algorithms({
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      difficulty: metadata.difficulty,
      slug: metadata.slug,
      code: cleanedCode.toString(),
      practiceProblems: metadata.practiceProblems
    });

    await doc.save();

    // Append to User
    const update_algo_to_user = await User.findOneAndUpdate(
      { clerkId: userID },
      { $addToSet: { Algo_id: doc._id } },
      { new: true }
    );

    res.json({ success: true, id: doc._id, metadata, user: update_algo_to_user });
  } catch (err) {
    console.error("Error in /make endpoint:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});


app.post("/sync-user", async (req, res) => {
  try {
    const { clerkId, name } = req.body;

    if (!clerkId) return res.status(400).json({ error: "clerkId is required" });

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = new User({ clerkId, name: name || "Unknown", Algo_id: [] });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error in /sync-user:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});


app.get("/get-algo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const algo = await Algorithms.findById(id);

    if (!algo) return res.status(404).json({ error: "Algorithm not found" });

    res.json({
      title: algo.title,
      description: algo.description,
      code: algo.code,
      metadata: {
        category: algo.category,
        difficulty: algo.difficulty,
        slug: algo.slug,
      },
    });
  } catch (err) {
    console.error("Error in /get-algo:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


app.post("/get_algorithms", async (req, res) => {
  try {
    // Frontend sends { id: userID }
    const { id } = req.body;

    // Check if ID is present
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing user ID in request body",
      });
    }

    // Find the user in the database
    let userAlgos = [];
    if(id!=="guest"){
      const userdet = await User.findOne({ clerkId: id });
  
      if (!userdet) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      // Get algorithms linked to this user
      const algoIds = userdet.Algo_id || [];
      if (algoIds.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No algorithms found for this user",
        });
      }

      // Fetch algorithm metadata (exclude code)
      userAlgos = await Algorithms.find(
        { _id: { $in: algoIds } },
        { code: 0 }
      );
    }

    // get verified algos
    const verifiedAlgos = await Algorithms.find({ isVerified: true }, { code: 0 });
    const algos = [...userAlgos, ...verifiedAlgos];
    
    res.json({
      success: true,
      data: algos,
    });
  } catch (err) {
    console.error("Error in /get_algorithms:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: err.message,
    });
  }
});


// POST route for J-Doodle code execution
app.post('/api/execute', async (req, res) => {
  // 1. Get credentials from .env
  const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
  const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

  if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
    console.error('J-Doodle credentials not found in .env file.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // 2. Get code from request body
  const { language: lang, code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided.' });
  }

  const langDetails = helpers.getJdoodleLanguage(lang);
  if (!langDetails) {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  // 3. Prepare J-Doodle payload
  const payload = {
    clientId: JDOODLE_CLIENT_ID,
    clientSecret: JDOODLE_CLIENT_SECRET,
    script: code,
    language: langDetails.language,
    versionIndex: langDetails.versionIndex,
  };

  // 4. Call J-Doodle API
  try {
    const jdoodleResponse = await fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await jdoodleResponse.json();

    // 5. Forward J-Doodle's response to the frontend
    res.status(jdoodleResponse.status).json(data);

  } catch (error) {
    console.error('Error calling J-Doodle:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// export const handler = serverless(app);
export default app;