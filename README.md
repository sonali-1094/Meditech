# Meditech

Meditech is a React and Flask powered personal healthcare workspace that helps users make everyday health decisions with AI guidance, disease prediction, risk analytics, record keeping, wellness tools, and emergency access.

The app is built with Vite, React, React Router, Flask, scikit-learn, MongoDB, and plain CSS. The frontend proxies `/api` requests to the Flask backend during development.

## Features

- Home dashboard with quick links for symptoms, records, health education, mental wellness, and emergency support.
- Smart Healthcare Assistant with disease prediction, mental health sentiment analysis, AI chatbot, health risk dashboard, doctor recommendations, medical report analyzer, health score analytics, and personalized recommendations.
- AI Health Guide page with searchable plain-language explanations for common conditions such as fever, cough, headache, stomach pain, cold, and fatigue.
- Symptom Checker that asks simple yes/no questions and returns a green, yellow, or red result with practical tips.
- Health Education section with categorized articles and prevention-focused health information.
- Mental Wellness tools including breathing support, mood check-ins, wellness techniques, daily exercises, quotes, and helpline information.
- Health Records page for adding records such as blood tests, blood pressure, sugar tests, X-rays, vaccinations, and checkups.
- Browser-local record storage using `localStorage`, so saved records stay on the user's device.
- Document upload UI for displaying selected health files during the current browser session.
- Doctor list with sample doctors, specialties, images, and an appointment booking modal.
- Public Health Awareness page that loads public health news from NewsData.
- Emergency page with India emergency numbers and an SOS alert button.
- Responsive navigation bar and footer shared across pages.

## Tech Stack

- React 19
- Vite 7
- React Router DOM 7
- JavaScript
- CSS
- ESLint
- Flask
- Scikit-learn
- Pandas
- PyMongo
- MongoDB

## Project Structure

```text
Meditech/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── db.py
│   ├── requirements.txt
│   ├── data/
│   ├── ml/
│   ├── models/
│   ├── routes/
│   └── training/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── App.css
│   ├── assets/
│   │   └── doctorList.js
│   └── components/
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       ├── AppointmentModal.jsx
│       ├── Mentalhealth.jsx
│       ├── mentalhealth/
│       │   ├── Anoymouschat.jsx
│       │   ├── Breathing.jsx
│       │   ├── DailyExercises.jsx
│       │   └── Quotes.jsx
│       └── pages/
│           ├── DoctorList.jsx
│           ├── Emergency.jsx
│           ├── HealthAssistant.jsx
│           ├── HealthEducation.jsx
│           ├── HealthRecords.jsx
│           ├── Mentalwellness.jsx
│           ├── MentalWellnessSolutions.jsx
│           ├── PublicHealth.jsx
│           └── SymptomChecker.jsx
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home dashboard |
| `/smart-healthcare` | Smart Healthcare Assistant |
| `/health-guide` | AI Health Guide |
| `/symptom-checker` | Symptom Checker |
| `/health-education` | Health Education |
| `/mental-solutions` | Mental Wellness Solutions |
| `/mental-wellness` | Mental wellness chat/mood page |
| `/mental-health` | Mental health tools page |
| `/health-records` | My Health Records |
| `/doctor-list` | Available Doctors |
| `/awareness` | Public Health Awareness |
| `/emergency` | Emergency Support |

## Getting Started

### Prerequisites

Install Node.js, npm, Python 3.10+, and MongoDB before running the full project.

### Installation

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python training\train_models.py
```

Create a frontend environment file only when you need to override the default API proxy:

```bash
copy .env.example .env
```

### Run Development Server

Run the Flask API in one terminal:

```bash
npm run dev:backend
```

Run the Vite frontend in another terminal:

```bash
npm run dev
```

If you use the backend virtual environment directly, activate it first:

```bash
cd backend
.venv\Scripts\activate
python app.py
```

Vite will print a local development URL in the terminal, usually:

```text
http://localhost:5173/
```

The Flask API runs at:

```text
http://localhost:5000/
```

If Vite prints `http proxy error: /api/health` with `ECONNREFUSED`, the frontend is running but the Flask API is not reachable at `http://localhost:5000`. Start the backend, install Python 3.10+ if `python` is not recognized, or set `VITE_PROXY_API_TARGET` to the backend URL you want Vite to proxy.

### Build for Production

```bash
npm run build
```

The production build is generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run dev:frontend` | Starts the Vite development server |
| `npm run dev:backend` | Starts the Flask backend on port `5000` |
| `npm run build` | Creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint on the project |

## Data and Storage

- Doctor profiles are stored in `src/assets/doctorList.js`.
- Starter ML datasets are stored in `backend/data/`.
- Trained scikit-learn artifacts are saved in `backend/models/`.
- AI API requests are logged to MongoDB in the `ai_events` collection when MongoDB is available.
- The frontend calls `/api` by default and Vite proxies those requests to Flask in development.
- Health records are saved in browser `localStorage` under the key `healthRecords`.
- Uploaded files are held in React component state and are not permanently uploaded to a backend.
- The Public Health Awareness page calls the NewsData API from `src/components/pages/PublicHealth.jsx`.

## Important Notes

- Meditech is an educational and personal health organization tool. It does not replace a doctor, diagnosis, emergency service, or professional medical advice.
- The Symptom Checker and AI Health Guide provide general guidance only.
- Emergency numbers shown in the app are focused on India, including `112` for general emergency support and `102` for ambulance support.
- The AI models are starter educational models and rule-based fallbacks. Replace the sample datasets with clinically reviewed, privacy-safe datasets before production medical use.
- MongoDB stores AI usage events only in the current implementation; authentication, secure user profiles, and protected report storage should be added before real patient deployment.
- The NewsData API key is currently present in the frontend source code. For production, move API keys to a backend service or environment-managed server-side endpoint.

## Future Improvements

- Add user authentication.
- Store health records in a secure backend database.
- Persist uploaded documents with secure file storage.
- Add real appointment booking and confirmation flow.
- Move public API calls behind a backend endpoint.
- Add automated tests for health record storage, symptom results, and route rendering.
- Improve accessibility and add more complete keyboard support across forms and modals.

## Author

Meditech healthcare project.
