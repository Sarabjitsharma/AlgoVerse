import fs from 'fs';
import path from 'path';

function extractMetadata(rawOutput) {
    const regex = /<metadata>\s*(\{.*?\})\s*<\/metadata>/s;
    const match = rawOutput.match(regex);
    if (match) {
        try {
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("Error parsing metadata JSON:", e);
        }
    }
    return null;
}


async function addMetadataToJson(metadata, jsonPath = '../frontEnd/src/data/algoirthms.json') {
    try {
        const fullPath = path.resolve(process.cwd(), jsonPath);
        
        // Create directory if it doesn't exist
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Initialize with empty structure if file doesn't exist
        let data = { articles: [] };
        if (fs.existsSync(fullPath)) {
            data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        }
        
        if (!data.articles) data.articles = [];
        data.articles.push(metadata);
        
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Metadata added successfully');
    } catch (err) {
        console.error("Error updating JSON file:", err);
        throw err; // Re-throw so main.js can handle it
    }
}

function cleanOutput(answer) {
    let content = answer.toString().trim();
    content = content.replace(/<explanation>.*?<\/explanation>/gis, '');
    content = content.replace(/<dependencies(-file)?>.*?<\/dependencies(-file)?>/gis, '');

    const codeMatch = content.match(/<code-file[^>]*>(.*?)<\/code-file>/s);
    const extracted = codeMatch ? codeMatch[1].trim() : "";
    return extracted.replace(/\n{3,}/g, '\n\n');
}

// Helper function to map your language names to J-Doodle's
function getJdoodleLanguage(lang) {
  switch (lang) {
    case 'javascript':
      return { language: 'nodejs', versionIndex: '4' }; // Node.js 18.15.0
    case 'python':
      return { language: 'python3', versionIndex: '4' }; // Python 3.9.9
    case 'cpp':
      return { language: 'cpp17', versionIndex: '1' }; // GCC 11.1.0
    default:
      return null;
  }
}

export default{ extractMetadata, addMetadataToJson, cleanOutput, getJdoodleLanguage};
