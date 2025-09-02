# EduAid Bot - AI-Powered Educational Assistant

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RockieRaheem/PLP_HACKATHON_2.git
cd PLP_HACKATHON_2/eduaid-bot
```

### 2. Environment Setup

#### Frontend Environment

```bash
cp .env.template .env
```

Edit `.env` and replace `your_openai_api_key_here` with your actual OpenAI API key.

#### Backend Environment

```bash
cd server
cp .env.template .env
```

Edit `server/.env` and replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Install Dependencies

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd server
npm install
```

### 4. Start the Application

#### Start Backend Server (Terminal 1)

```bash
cd server
npm start
```

Backend will run on http://localhost:5000

#### Start Frontend (Terminal 2)

```bash
npm start
```

Frontend will run on http://localhost:3000

### 5. OpenAI Integration

This project uses **STRICT OpenAI integration** - no hardcoded responses!

- All AI responses come directly from OpenAI GPT-3.5-turbo
- When quota is exceeded, users see a friendly message explaining the situation
- Perfect for hackathon demonstrations of real AI integration

### Features

- 🤖 **Real OpenAI Integration**: Direct GPT-3.5-turbo API calls
- 📚 **Educational Focus**: Tailored for African curricula (WAEC, KCSE, Matric)
- 💬 **Smart Error Handling**: Friendly messages when API limits are reached
- 🔐 **Secure Backend**: API keys protected on server-side
- 🎓 **Multiple Modes**: Tutor, Homework Help, Exam Prep, Creative

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Chat with OpenAI (requires message, mode, conversationHistory)

### For Hackathon Judges

This project demonstrates:

- ✅ Real OpenAI API integration (not fake responses)
- ✅ Proper error handling and user feedback
- ✅ Secure backend architecture
- ✅ Professional development practices
