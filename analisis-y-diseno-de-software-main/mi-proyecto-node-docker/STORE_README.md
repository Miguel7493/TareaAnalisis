# 🏪 Zustand Store Documentation - Aurora Privé

## 📋 Overview

Complete Zustand state management implementation for UsmBank (Aurora Privé) with TypeScript, JWT authentication, and full backend integration.

---

## 📁 File Structure

```
src/
├── store/
│   └── useStore.ts          # Main Zustand store
├── services/
│   └── api.ts               # API client with JWT interceptor
└── types/
    └── index.ts             # TypeScript type definitions
```

---

## 🎯 Features Implemented

### ✅ State Management
- **Auth State**: User authentication with JWT
- **Simulation State**: Loan simulations (public + authenticated)
- **Loan Request State**: Multi-step wizard for loan applications
- **Creditos State**: Loan management and amortization tables

### ✅ Middleware
- **Persist**: Automatic localStorage persistence
- **DevTools**: Redux DevTools integration for debugging

### ✅ TypeScript
- Fully typed with comprehensive interfaces
- Type-safe API responses
- Strict type checking enabled

### ✅ API Integration
- JWT token management (localStorage)
- Automatic token injection in authenticated requests
- Error handling with user-friendly messages
- Support for all backend endpoints

---

## 🚀 Quick Start

### 1. Installation

Already installed! The following packages are now available:
- `zustand` v5.0.8

### 2. Usage in Components

#### Example 1: Authentication

```tsx
import { useAuth } from '../store/useStore';

function LoginForm() {
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const success = await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });

    if (success) {
      console.log('Login successful!');
    }
  };

  if (isAuthenticated) {
    return <div>Welcome back!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### Example 2: Loan Simulation (Public)

```tsx
import { useSimulation } from '../store/useStore';

function SimulatorPublic() {
  const { simulate, current, isLoading, error } = useSimulation();

  const handleSimulate = async () => {
    const success = await simulate({
      monto: 5000000,
      tasa_interes: 2.5,
      plazo_meses: 24,
    });

    if (success && current) {
      console.log('Monthly payment:', current.cuota_mensual);
    }
  };

  return (
    <div>
      <button onClick={handleSimulate} disabled={isLoading}>
        Simulate Loan
      </button>

      {current && (
        <div>
          <p>Monthly: ${current.cuota_mensual.toLocaleString()}</p>
          <p>Total: ${current.total_pagar.toLocaleString()}</p>
          <p>Interest: ${current.total_intereses.toLocaleString()}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

#### Example 3: Loan Request Wizard

```tsx
import { useLoanWizard } from '../store/useStore';

function LoanWizard() {
  const {
    currentStep,
    maxSteps,
    formData,
    setFormData,
    nextStep,
    prevStep,
    submit,
    isLoading,
  } = useLoanWizard();

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && formData.monto_solicitado) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    const success = await submit();
    if (success) {
      console.log('Loan request submitted!');
    }
  };

  return (
    <div>
      <h2>Step {currentStep} of {maxSteps}</h2>

      {currentStep === 1 && (
        <input
          type="number"
          value={formData.monto_solicitado || ''}
          onChange={(e) => setFormData({ monto_solicitado: +e.target.value })}
          placeholder="Loan amount"
        />
      )}

      {currentStep === 2 && (
        <select
          value={formData.tipo_credito || 'CONSUMO'}
          onChange={(e) => setFormData({ tipo_credito: e.target.value as any })}
        >
          <option value="CONSUMO">Consumer Loan</option>
          <option value="HIPOTECARIO">Mortgage</option>
          <option value="AUTOMOTRIZ">Auto Loan</option>
          <option value="EMPRESARIAL">Business Loan</option>
        </select>
      )}

      <div>
        {currentStep > 1 && <button onClick={prevStep}>Back</button>}
        {currentStep < maxSteps && <button onClick={handleNext}>Next</button>}
        {currentStep === maxSteps && (
          <button onClick={handleSubmit} disabled={isLoading}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
```

#### Example 4: User Profile

```tsx
import { useAuth } from '../store/useStore';

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <h2>{user.nombre} {user.apellido}</h2>
      <p>{user.email}</p>

      {user.cliente && (
        <div>
          <p>RUT: {user.cliente.rut}</p>
          <p>Score: {user.cliente.score_credito}</p>
          <p>Type: {user.cliente.tipo}</p>
          <p>Income: ${user.cliente.ingresos_mensuales.toLocaleString()}</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Example 5: Loan List

```tsx
import { useEffect } from 'react';
import { useCreditos } from '../store/useStore';

function LoanList() {
  const { creditos, loadAll, isLoading, error } = useCreditos();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (isLoading) return <div>Loading loans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Loans</h2>
      {creditos.map((credito) => (
        <div key={credito.id}>
          <h3>{credito.tipo_credito}</h3>
          <p>Amount: ${credito.monto_aprobado?.toLocaleString()}</p>
          <p>Status: {credito.estado}</p>
          <p>Monthly: ${credito.cuota_mensual.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Store Structure

### Auth State
```typescript
{
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
}
```

**Actions:**
- `login(data)` - Login with email/password
- `register(data)` - Register new user
- `logout()` - Clear session
- `checkAuth()` - Verify token and load profile
- `updateProfile(data)` - Update user data
- `clearAuthError()` - Clear error message

### Simulation State
```typescript
{
  currentSimulation: Simulation | null;
  simulationHistory: Simulation[];
  simulationLoading: boolean;
  simulationError: string | null;
}
```

**Actions:**
- `simulateLoan(data)` - Calculate loan simulation
- `clearSimulation()` - Clear current simulation
- `loadSimulationHistory()` - Load past simulations (auth required)
- `clearSimulationError()` - Clear error

### Loan Request State (Wizard)
```typescript
{
  loanRequest: {
    currentStep: number;
    maxSteps: number;
    formData: Partial<LoanFormData>;
    score: number | null;
    isLoading: boolean;
    error: string | null;
  }
}
```

**Actions:**
- `setLoanFormData(data)` - Update form fields
- `nextStep()` - Move to next wizard step
- `prevStep()` - Move to previous step
- `goToStep(n)` - Jump to specific step
- `submitLoanRequest()` - Submit loan application
- `resetLoanWizard()` - Reset wizard to initial state

### Creditos State
```typescript
{
  creditos: Credito[];
  currentCredito: Credito | null;
  cuotas: Cuota[];
  estadisticas: ClienteEstadisticas | null;
  creditosLoading: boolean;
  creditosError: string | null;
}
```

**Actions:**
- `loadCreditos()` - Load all loans
- `loadCreditoById(id)` - Load loan with amortization table
- `loadEstadisticas()` - Load client statistics
- `createCredito(data)` - Create new loan
- `clearCreditosError()` - Clear error

---

## 🔑 API Service

The `api.ts` service provides:

### Token Management
```typescript
api.token.get()    // Get stored JWT
api.token.set(token)   // Save JWT to localStorage
api.token.remove()     // Clear JWT
```

### Auth Endpoints
```typescript
api.auth.register(data)      // POST /api/auth/register
api.auth.login(data)         // POST /api/auth/login
api.auth.getProfile()        // GET /api/auth/profile (auth)
api.auth.changePassword(data) // PUT /api/auth/change-password (auth)
api.auth.verifyToken()       // POST /api/auth/verify-token (auth)
```

### Simulation Endpoints
```typescript
api.simulation.simulate(data)   // POST /api/simulaciones
api.simulation.getHistory()     // GET /api/simulaciones (auth)
```

### Credito Endpoints
```typescript
api.credito.create(data)      // POST /api/creditos (auth)
api.credito.getAll()          // GET /api/creditos (auth)
api.credito.getById(id)       // GET /api/creditos/:id (auth)
api.credito.getStatistics()   // GET /api/creditos/estadisticas (auth)
```

---

## 🎨 Custom Hooks (Selectors)

Pre-built hooks for easier usage:

```typescript
import { useAuth, useSimulation, useLoanWizard, useCreditos } from './store/useStore';
```

Each hook returns only the relevant state and actions for that domain.

---

## 🔐 Authentication Flow

1. **Login/Register** → Store receives JWT token
2. **Token saved** to localStorage automatically
3. **All authenticated requests** include `Authorization: Bearer <token>` header
4. **Token validation** on app start via `checkAuth()`
5. **Logout** clears token and resets all state

---

## 💾 Persistence

The store automatically persists to localStorage:
- JWT token
- User profile
- Authentication status
- Simulation history

**Storage key:** `aurora-prive-storage`

---

## 🛠️ Development Tools

### Redux DevTools

The store is configured with Redux DevTools support. Install the browser extension to debug:

- View state changes in real-time
- Time-travel debugging
- Action history
- State snapshots

---

## 📝 TypeScript Types

All types are defined in `src/types/index.ts`:

- `User` - User profile with optional client data
- `Cliente` - Client financial profile
- `Simulation` - Loan simulation result
- `Credito` - Loan request/status
- `Cuota` - Amortization payment
- `TipoCredito` - Loan types (CONSUMO, HIPOTECARIO, etc.)
- `EstadoCredito` - Loan status (PENDIENTE, APROBADO, etc.)

---

## 🧪 Testing the Store

### Check Store in Browser Console

```javascript
// Access the store from console (for debugging)
window.__ZUSTAND_STORE__ = useStore.getState();

// Check current state
console.log(useStore.getState());

// Subscribe to changes
useStore.subscribe(console.log);
```

---

## 🚦 Next Steps

1. **Connect home.tsx** to use `useAuth()` for login/register
2. **Create Simulator component** using `useSimulation()`
3. **Build Loan Wizard** using `useLoanWizard()`
4. **Create Dashboard** to display loans using `useCreditos()`
5. **Add protected routes** checking `isAuthenticated`

---

## ✅ Checklist

- [x] Zustand installed
- [x] Store created with all states
- [x] API service with JWT interceptor
- [x] TypeScript types defined
- [x] Token persistence (localStorage)
- [x] Custom hooks (selectors)
- [x] DevTools integration
- [x] Error handling
- [x] Loading states
- [x] Documentation

---

## 🎯 Store is 100% Ready!

The Zustand store is fully implemented and ready to use. You can now:

1. Import hooks in your components
2. Call actions (login, simulate, etc.)
3. Access reactive state
4. All backend integration is working

**No UI changes needed yet** - the store works independently!

---

**Next Task:** Integrate the store with your React components (`home.tsx`, simulador, etc.)
