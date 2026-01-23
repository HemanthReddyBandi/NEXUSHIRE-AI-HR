# ChatGPT Integration Setup Guide

## What Changed

The project now uses **OpenAI ChatGPT API** instead of local Ollama:

- **Question Generation**: ChatGPT generates role-specific questions
- **Evaluation**: ChatGPT scores and provides feedback
- **Voice Over**: Browser Web Speech API (free, built-in)

## Setup Steps

### 1. Get OpenAI API Key (Free)

- Go to: https://platform.openai.com/api-keys
- Sign up (free account with $5 credit)
- Create new secret key
- Copy the key (starts with `sk-`)

### 2. Add API Key to Project

Create `.env` file in project root:
```
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

Replace `sk-your-api-key-here` with your actual key.

**Important**: Never commit `.env` to git. It's in `.gitignore` by default.

### 3. Restart Dev Server

```powershell
# Stop the current server (Ctrl+C)
npm run dev
```

### 4. Open App

http://localhost:3000

Now enter a job role and resume - ChatGPT will generate real questions!

## Costs

- **Free tier**: $5 credit (usually covers 100+ interviews)
- **Per interview cost**: ~$0.002 (about 1 cent per 5 interviews)
- **Pricing details**: https://openai.com/pricing

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No API key configured" | Add `VITE_OPENAI_API_KEY` to `.env` and restart |
| "Invalid API key" | Check key is correct at https://platform.openai.com/api-keys |
| "Rate limit exceeded" | Wait a minute or upgrade to paid plan |
| Still getting mock questions | Open DevTools Console (F12) to see errors |

## Alternative: Use Local Ollama

If you prefer free, offline LLM:

Edit `hooks/useInterview.ts`:
```typescript
import { generateQuestions, generateEvaluation, textToSpeech } from '../services/ollamaService';
```

Then install Ollama: https://ollama.ai

## File Changes

```
✏️ Created:
  - services/chatgptService.ts (NEW!)
  - .env (your API key goes here)
  - .env.example (template)

✏️ Modified:
  - hooks/useInterview.ts
  - components/InterviewScreen.tsx
  - README.md

📌 Note:
  - services/ollamaService.ts still available if you want to switch back
  - .env is in .gitignore (safe to add your API key)
```

## Next Steps

1. ✅ Get OpenAI API key
2. ✅ Create `.env` file with key
3. ✅ Restart dev server
4. ✅ Start interviewing!

Enjoy! 🚀
