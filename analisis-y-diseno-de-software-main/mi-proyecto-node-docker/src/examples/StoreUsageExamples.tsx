/**
 * Store Usage Examples for Aurora Privé
 * Practical examples of how to use the Zustand store in React components
 */

import { useEffect, useState } from 'react';
import { useAuth, useSimulation, useLoanWizard, useCreditos } from '../store/useStore';

// ==================== EXAMPLE 1: LOGIN COMPONENT ====================

export function LoginExample() {
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login({ email, password });

    if (success) {
      console.log('Login successful!');
      // Redirect to dashboard or show success message
    }
  };

  if (isAuthenticated && user) {
    return (
      <div>
        <h2>Welcome, {user.nombre}!</h2>
        <p>Email: {user.email}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login to Aurora Privé</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ==================== EXAMPLE 2: REGISTRATION COMPONENT ====================

export function RegisterExample() {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    fecha_nacimiento: '',
    ingresos_mensuales: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await register(formData);

    if (success) {
      console.log('Registration successful!');
      // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        type="text"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        placeholder="First Name"
        required
      />

      <input
        type="text"
        value={formData.apellido}
        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
        placeholder="Last Name"
        required
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />

      <input
        type="text"
        value={formData.rut}
        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
        placeholder="RUT (12345678-9)"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

// ==================== EXAMPLE 3: LOAN SIMULATOR (PUBLIC) ====================

export function SimulatorExample() {
  const { simulate, current, isLoading, error } = useSimulation();
  const [monto, setMonto] = useState(5000000);
  const [plazo, setPlazo] = useState(24);
  const [tasa, setTasa] = useState(2.5);

  const handleSimulate = async () => {
    await simulate({
      monto,
      plazo_meses: plazo,
      tasa_interes: tasa,
    });
  };

  return (
    <div>
      <h2>Loan Simulator</h2>

      <div>
        <label>
          Amount: ${monto.toLocaleString()}
          <input
            type="range"
            min="100000"
            max="50000000"
            step="100000"
            value={monto}
            onChange={(e) => setMonto(+e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Term: {plazo} months
          <input
            type="range"
            min="3"
            max="360"
            value={plazo}
            onChange={(e) => setPlazo(+e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Interest Rate: {tasa}%
          <input
            type="number"
            step="0.1"
            value={tasa}
            onChange={(e) => setTasa(+e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSimulate} disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Simulate'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {current && (
        <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0' }}>
          <h3>Simulation Result</h3>
          <p>
            <strong>Monthly Payment:</strong> $
            {current.cuota_mensual.toLocaleString('es-CL')}
          </p>
          <p>
            <strong>Total to Pay:</strong> $
            {current.total_pagar.toLocaleString('es-CL')}
          </p>
          <p>
            <strong>Total Interest:</strong> $
            {current.total_intereses.toLocaleString('es-CL')}
          </p>
        </div>
      )}
    </div>
  );
}

// ==================== EXAMPLE 4: LOAN REQUEST WIZARD ====================

export function LoanWizardExample() {
  const {
    currentStep,
    maxSteps,
    formData,
    setFormData,
    nextStep,
    prevStep,
    submit,
    isLoading,
    error,
  } = useLoanWizard();

  const handleSubmit = async () => {
    const success = await submit();
    if (success) {
      alert('Loan request submitted successfully!');
    }
  };

  return (
    <div>
      <h2>Loan Application Wizard</h2>
      <p>
        Step {currentStep} of {maxSteps}
      </p>

      {/* STEP 1: Loan Type */}
      {currentStep === 1 && (
        <div>
          <h3>Select Loan Type</h3>
          <select
            value={formData.tipo_credito || 'CONSUMO'}
            onChange={(e) =>
              setFormData({ tipo_credito: e.target.value as any })
            }
          >
            <option value="CONSUMO">Consumer Loan</option>
            <option value="HIPOTECARIO">Mortgage</option>
            <option value="AUTOMOTRIZ">Auto Loan</option>
            <option value="EMPRESARIAL">Business Loan</option>
          </select>
        </div>
      )}

      {/* STEP 2: Amount and Term */}
      {currentStep === 2 && (
        <div>
          <h3>Loan Details</h3>
          <input
            type="number"
            value={formData.monto_solicitado || ''}
            onChange={(e) => setFormData({ monto_solicitado: +e.target.value })}
            placeholder="Amount"
          />
          <input
            type="number"
            value={formData.plazo_meses || ''}
            onChange={(e) => setFormData({ plazo_meses: +e.target.value })}
            placeholder="Term (months)"
          />
        </div>
      )}

      {/* STEP 3: Interest Rate and Reason */}
      {currentStep === 3 && (
        <div>
          <h3>Additional Information</h3>
          <input
            type="number"
            step="0.1"
            value={formData.tasa_interes || ''}
            onChange={(e) => setFormData({ tasa_interes: +e.target.value })}
            placeholder="Interest Rate (%)"
          />
          <textarea
            value={formData.motivo || ''}
            onChange={(e) => setFormData({ motivo: e.target.value })}
            placeholder="Reason for loan"
          />
        </div>
      )}

      {/* STEP 4: Review */}
      {currentStep === 4 && (
        <div>
          <h3>Review Your Application</h3>
          <p>Type: {formData.tipo_credito}</p>
          <p>Amount: ${formData.monto_solicitado?.toLocaleString()}</p>
          <p>Term: {formData.plazo_meses} months</p>
          <p>Rate: {formData.tasa_interes}%</p>
          <p>Reason: {formData.motivo}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        {currentStep > 1 && (
          <button onClick={prevStep} disabled={isLoading}>
            Back
          </button>
        )}

        {currentStep < maxSteps && (
          <button onClick={nextStep} disabled={isLoading}>
            Next
          </button>
        )}

        {currentStep === maxSteps && (
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== EXAMPLE 5: USER DASHBOARD ====================

export function DashboardExample() {
  const { user, logout } = useAuth();
  const { creditos, loadAll, isLoading } = useCreditos();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <header>
        <h1>Welcome, {user.nombre}!</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section>
        <h2>Profile Information</h2>
        <p>Email: {user.email}</p>
        {user.cliente && (
          <>
            <p>RUT: {user.cliente.rut}</p>
            <p>Credit Score: {user.cliente.score_credito}</p>
            <p>Client Type: {user.cliente.tipo}</p>
            <p>
              Monthly Income: $
              {user.cliente.ingresos_mensuales.toLocaleString('es-CL')}
            </p>
          </>
        )}
      </section>

      <section>
        <h2>My Loans</h2>
        {isLoading ? (
          <p>Loading loans...</p>
        ) : creditos.length === 0 ? (
          <p>No loans yet</p>
        ) : (
          <ul>
            {creditos.map((credito) => (
              <li key={credito.id}>
                <h3>{credito.tipo_credito}</h3>
                <p>Amount: ${credito.monto_aprobado?.toLocaleString()}</p>
                <p>Status: {credito.estado}</p>
                <p>Monthly: ${credito.cuota_mensual.toLocaleString()}</p>
                <p>Date: {new Date(credito.fecha_solicitud).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ==================== EXAMPLE 6: PROTECTED ROUTE ====================

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <div>Please login to access this page</div>;
  }

  return <>{children}</>;
}

// ==================== EXAMPLE 7: AUTO-LOGIN ON APP START ====================

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    init();
  }, [checkAuth]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
