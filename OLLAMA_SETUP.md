# Interview Platform with Ollama Setup Guide

## What Changed

The project now uses **Ollama** (free, open-source LLM) instead of Google Gemini API:

- **Question Generation**: Uses Ollama's `mistral` model (running locally)
- **Text-to-Speech**: Uses browser's built-in Web Speech API (no external service needed)
- **Evaluation**: Uses Ollama to score and provide feedback on answers

## Prerequisites

### 1. Install Ollama

Ollama runs LLMs locally on your machine without needing cloud API keys.

#### Windows:
- Download from: https://ollama.ai/download
- Run the installer and follow the prompts
- Restart your terminal/PowerShell after installation

#### macOS:
```bash
brew install ollama
```

#### Linux:
```bash
curl https://ollama.ai/install.sh | sh
```

### 2. Start Ollama Service

After installation, Ollama runs as a background service on `http://localhost:11434`.

#### Windows:
- Ollama starts automatically after installation
- Check it's running: Open PowerShell and run:
  ```powershell
  curl.exe http://localhost:11434/api/tags
  ```
  You should see a JSON response.

#### macOS / Linux:
```bash
ollama serve
```

### 3. Pull a Model

Before using Ollama, you need to download a model. The project uses `mistral` by default.

#### In a new terminal/PowerShell:
```bash
ollama pull mistral
```

This downloads the Mistral model (~5GB). Other options:
- `ollama pull llama2` (7B model, smaller and faster)
- `ollama pull neural-chat` (smaller model)

**First-time setup takes 5-10 minutes depending on your internet speed.**

## Running the Project

Once Ollama is set up:

```powershell
npm run dev
```

- Open http://localhost:3000 in your browser
- The app will now generate real questions using Ollama instead of mock questions
- Voice over is provided by the browser's Web Speech API

## Troubleshooting

### "Connection refused" or "localhost:11434 not responding"
- Ensure Ollama is running (Windows: check system tray; macOS/Linux: `ollama serve`)
- Verify with: `curl.exe http://localhost:11434/api/tags`

### Questions still showing "Mock Question" or "Fallback Question"
- Check browser console for errors (F12 → Console tab)
- Make sure the model was pulled: `ollama list`
- If needed, pull again: `ollama pull mistral`

### Slow question generation
- Ollama models are slower on CPU-only machines. GPU support:
  - **NVIDIA GPU**: Ollama auto-detects CUDA
  - **AMD GPU**: Use `ollama run mistral --gpu=amd`
  - **Apple Silicon**: Works out of the box

### Text-to-speech not working
- Browser Web Speech API requires HTTPS in production (works on localhost)
- Check browser console for speech synthesis errors
- Try different languages in browser settings

## Performance Notes

- **First run**: Slow (model must load into memory)
- **Subsequent runs**: Faster (model stays loaded)
- **CPU vs GPU**: GPU ~10-20x faster. Recommend GPU for smooth experience
- **Model size**: `mistral` is 7B (medium). Use `neural-chat` for faster responses on slower machines

## Optional: Use Different Models

Edit `services/ollamaService.ts` and change the `model` field:

```typescript
// Line 35: Change "mistral" to another model
body: JSON.stringify({
  model: "llama2",  // or "neural-chat", "dolphin", etc.
  // ...
})
```

Then pull the new model:
```bash
ollama pull llama2
```

## Project Structure

```
services/
  ├── ollamaService.ts       ← LLM calls (questions, evaluation)
  └── geminiService.ts       ← (Deprecated, for reference)
components/
  └── InterviewScreen.tsx    ← Uses Web Speech API for TTS
hooks/
  └── useInterview.ts        ← Orchestrates the flow
```

## API Endpoints Used

- **Ollama Generate**: `POST http://localhost:11434/api/generate`
  - Input: `{model, prompt, stream, temperature}`
  - Output: `{response: string}`

## Security

- All processing happens locally (no data sent to cloud)
- API key not needed
- Perfect for development and offline use

## License

- Ollama: MIT
- Mistral Model: License depends on model (check ollama.ai)
- Project: Your license here

---

**Questions?** Check the Ollama docs: https://ollama.ai
