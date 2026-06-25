# InterviewIQ AI

InterviewIQ AI is a full-stack interview preparation app that generates resume-aware mock interviews, evaluates answers with AI, tracks interview history, and supports credit purchases through Razorpay.

## Features

- Google authentication with Firebase and JWT cookies
- Resume PDF upload and text extraction
- Resume chunking, embeddings, and Pinecone vector search
- AI-generated HR or technical interview questions
- Timed answer submission with AI feedback and scoring
- Interview reports with confidence, communication, correctness, and final score
- Interview history for logged-in users
- Credit-based usage system with Razorpay payments

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- Firebase Auth
- Recharts
- jsPDF

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer
- pdfjs-dist
- OpenRouter chat completions
- Google Gemini embeddings
- Pinecone
- Razorpay

## Project Structure

```text
interviewIQ/
  client/                 React + Vite frontend
    src/
      components/         Shared UI and interview step components
      pages/              App pages and routes
      Redux/              Redux store and user state
      utils/              Firebase setup
  server/                 Express backend
    config/               Database, JWT, and Pinecone setup
    controllers/          Route handlers
    middleware/           Auth and upload middleware
    models/               Mongoose models
    routes/               API routes
    services/             AI, embedding, vector, and payment services
```

## Prerequisites

- Node.js
- npm
- MongoDB database
- Firebase project with Google authentication enabled
- OpenRouter API key
- Google Gemini API key
- Pinecone API key and index
- Razorpay account and API keys

## Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=6000
CLIENT_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

Create a `.env` file inside `client/`:

```env
VITE_SERVER_URL=http://localhost:6000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

The Firebase project values other than the API key are currently configured in `client/src/utils/firebase.js`.

## Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Running Locally

Start the backend:

```bash
cd server
node index.js
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

Frontend scripts from `client/package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

The backend currently does not define a start script, so run it directly with:

```bash
node index.js
```

## API Overview

Base URL:

```text
http://localhost:6000
```

Auth routes:

- `POST /api/auth/google` - sign in or create a user with Google profile data
- `GET /api/auth/logout` - clear the auth cookie

User routes:

- `GET /api/user/current-user` - fetch the currently authenticated user

Interview routes:

- `POST /api/interview/resume` - upload and analyze a resume PDF
- `POST /api/interview/generate-questions` - generate interview questions
- `POST /api/interview/submit-answer` - submit and evaluate an answer
- `POST /api/interview/finish` - finish an interview and calculate report metrics
- `GET /api/interview/get-interview` - get interview history
- `GET /api/interview/report/:id` - get a specific interview report

Payment routes:

- `POST /api/payment/order` - create a Razorpay order
- `POST /api/payment/verify` - verify payment and add credits

Protected routes require the JWT cookie set during Google authentication.

## How It Works

1. The user signs in with Google.
2. The user uploads a resume PDF.
3. The backend extracts resume text, splits it into chunks, creates embeddings, and stores them in Pinecone.
4. The user chooses a role, experience level, and interview mode.
5. The backend retrieves relevant resume context and asks AI to generate five interview questions.
6. The user answers each timed question.
7. AI evaluates confidence, communication, correctness, and gives short feedback.
8. The final report is saved and can be viewed later from interview history.

## Notes

- New users start with `100` credits.
- Generating an interview costs `50` credits.
- Uploaded resume files are removed after processing.
- Razorpay checkout is loaded in `client/index.html`.
- Cookies are configured with `secure: true` and `sameSite: "none"`, which is suitable for deployed cross-site frontend/backend setups. Local development may require HTTPS or adjusted cookie settings depending on your browser environment.

