# AgroID — AI Livestock Identification Platform

Official AI-powered livestock biometric identification platform for Kyrgyzstan.

## Tech Stack

- React 18 + Vite
- TailwindCSS
- React Router DOM v6
- Framer Motion
- Axios
- Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agroid.kg | admin123 |
| Farmer | farmer@agroid.kg | farmer123 |
| Insurance | insurance@agroid.kg | insurance123 |

## Backend API

Configure backend URL in `src/services/api.js`:

```js
const BASE_URL = 'http://127.0.0.1:8000'
```

### Endpoints used:
- `POST /cows/register` — Register animal (multipart/form-data)
- `POST /verify/` — Verify animal by photo
- `GET /cows/` — List all animals
- `GET /cows/{id}` — Animal details
- `DELETE /cows/{id}` — Delete animal
- `GET /verify/history` — Verification history

> The app runs in **demo mode** when the backend is unavailable — all features work with local fallbacks.

## Project Structure

```
src/
├── components/
│   ├── verification/LivestockPassport.jsx
│   └── ...
├── context/AuthContext.jsx
├── hooks/useAuth.js
├── layouts/
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── RegisterAnimal.jsx
│   ├── VerifyAnimal.jsx
│   ├── Animals.jsx
│   ├── AnimalDetails.jsx
│   ├── History.jsx
│   ├── Settings.jsx
│   └── Admin.jsx
├── router/AppRouter.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── cowService.js
│   └── verifyService.js
└── utils/
    ├── constants.js
    └── helpers.js
```
