# Aglet POS Frontend

A Point of Sale (POS) system frontend built with React and Vite.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

## Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd aglet-pos-frontend/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use). The dev server includes Hot Module Replacement (HMR) for instant updates as you edit files.

## Available Scripts

- **`npm run dev`** - Start the development server
- **`npm run build`** - Build the app for production
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/` - Source code
  - `pages/` - Application pages (Dashboard, Products, Sales, Checkout, Settings)
  - `assets/` - Static assets
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point
- `public/` - Public static files
- `index.html` - HTML template

## Technologies Used

- **React** 19.1.1 - UI library
- **Vite** 7.1.2 - Build tool and dev server
- **React Router DOM** 7.8.2 - Routing
- **Heroicons & React Icons** - Icon libraries
- **ESLint** - Code linting
