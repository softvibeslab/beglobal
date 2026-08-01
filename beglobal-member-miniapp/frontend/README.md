# BeGlobal Member Miniapp Frontend

React 18 + TypeScript + Tailwind CSS + Framer Motion para la miniapp de Telegram.

## SPRINT 1: Foundations

### Estructura

```
src/
├── components/
│   ├── common/              - Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   └── features/            - Componentes por feature
│       └── Dashboard/
│           └── ProfileCard.tsx
├── hooks/
│   ├── useTelegram.ts      - Integración Telegram WebApp SDK
│   └── useApi.ts           - Cliente HTTP con auth
├── store/
│   └── gameStore.ts        - Estado global (Zustand)
├── tests/
│   └── setup.ts            - Configuración Vitest
├── App.tsx                 - Routing principal
├── main.tsx                - Punto de entrada
└── index.css               - Estilos globales
```

### Instalación

```bash
cd frontend
npm install
cp .env.example .env
```

### Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173

### Type checking

```bash
npm run type-check
```

### Tests

```bash
npm test
npm run test:ui
```

### Build

```bash
npm run build
npm run preview
```

## Componentes SPRINT 1

### Common Library

- **Button** - Con variantes (primary, secondary, outline, danger, success)
- **Card** - Container con header, title, content
- **Badge** - Etiquetas con estados
- **Modal** - Diálogos animados
- **ProgressBar** - Barras de progreso animadas

### Features

- **ProfileCard** - Muestra XP, level, streak

## Next: SPRINT 2

- Onboarding flow (5 pantallas)
- Diagnosis form
- Lesson list view
- Quiz interface
