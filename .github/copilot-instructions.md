# Aglet POS System - AI Coding Agent Instructions

## Project Overview
Aglet is a shoe resale Point of Sale system with a React frontend (`/frontend`) and Node.js backend (`../Aglet-Sales-Backend`). The system manages shoe inventory and sales transactions with real-time WebSocket integration to an external Inventory Management System (IMS).

## Architecture & Key Concepts

### Backend Architecture (Express.js + Sequelize + PostgreSQL)
- **Models**: `Shoe`, `SaleTransaction`, `SaleTransactionDetail` with proper Sequelize associations
- **Routes**: RESTful APIs under `/api/shoes` and `/api/sales` with comprehensive Swagger documentation
- **External Integration**: WebSocket connection to IMS service for real-time inventory updates
- **Database**: PostgreSQL with environment-based configuration supporting both local and cloud deployments

### Frontend Architecture (React + Vite)
- **Routing**: React Router with expandable sidebar navigation (hover to expand from 64px to 256px)
- **Pages**: Dashboard, Checkout, Products, Sales, Settings
- **State Management**: Component-level state with fetch-based API calls to `http://localhost:3000/api`
- **Styling**: CSS custom properties with consistent design system

## Development Workflows

### Backend Development
```bash
cd Aglet-Sales-Backend
npm run dev          # Start with nodemon for hot reload
npm start           # Production start
```
- **API Documentation**: Available at `http://localhost:3000/api-docs` (Swagger UI)
- **Database Sync**: Models auto-sync on startup with `{ alter: true }`
- **Environment**: Uses `.env` file with fallbacks for PostgreSQL connection

### Frontend Development
```bash
cd aglet-pos-frontend/frontend
npm run dev         # Vite dev server with HMR
npm run build       # Production build
npm run preview     # Preview production build
```

## Project-Specific Patterns

### API Integration Pattern
Frontend components use consistent pattern:
```jsx
const API_URL = "http://localhost:3000/api";
// Fetch with error handling and state updates
const res = await fetch(`${API_URL}/shoes`);
```

### Model Associations (Critical for Queries)
```javascript
SaleTransaction.hasMany(SalesTransactionDetail, { foreignKey: "transactionId", as: "details" });
SalesTransactionDetail.belongsTo(Shoe, { foreignKey: "shoeId" });
```
- Always include `as: "details"` alias when querying sale transactions
- Use `include` for eager loading related data

### WebSocket Integration
- IMS service connection handled automatically on server start
- Reconnection logic built-in with 5-second intervals
- Environment variables: `IMS_HOST`, `IMS_PORT` for external service

### Swagger Documentation Pattern
All routes documented with JSDoc comments:
```javascript
/**
 * @swagger
 * /api/shoes:
 *   post:
 *     summary: Create a new shoe
 *     tags: [Shoes]
 */
```

## Key Files & Directories

### Backend Structure
- `src/models/index.js`: Central model definitions and associations
- `src/services/ims.js`: External WebSocket service integration
- `src/config/database.js`: PostgreSQL connection with environment fallbacks
- `src/config/swagger.js`: OpenAPI 3.0 documentation setup

### Frontend Structure  
- `src/App.jsx`: Router setup with collapsible sidebar navigation
- `src/pages/`: Main application screens (Products, Sales, Checkout, etc.)
- Navigation uses Heroicons with consistent styling patterns

## Database Schema Notes
- **Shoes**: Include `brand`, `model`, `colorway`, `size`, `condition`, `purchasePrice`, `price`, `currentStock`
- **Condition Enum**: "New", "Used", "Like New"
- **Decimal Types**: Use `DECIMAL(12, 2)` for monetary values
- **Timestamps**: Automatically added to all models

## Environment Configuration
Backend supports multiple environment variable formats for database connection:
- Standard: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`  
- PostgreSQL format: `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`

When working with this codebase:
1. Always start backend first (`npm run dev` in `Aglet-Sales-Backend`)
2. Check API docs at `/api-docs` for endpoint specifications
3. Frontend assumes backend runs on `localhost:3000`
4. Use Sequelize model associations for complex queries
5. Follow existing Swagger documentation patterns for new endpoints