/**
 * Zustand Store for UsmBank (Aurora Privé)
 * Centralized state management with TypeScript
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  User,
  Simulation,
  LoanFormData,
  Credito,
  Cuota,
  ClienteEstadisticas,
  TipoCredito,
  LoginData,
  RegisterData,
  SimulationRequest,
} from '../types';
import api from '../services/api';

// ==================== STORE STATE INTERFACE ====================

interface StoreState {
  // ========== AUTH STATE ==========
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;

  // ========== SIMULATION STATE ==========
  currentSimulation: Simulation | null;
  simulationHistory: Simulation[];
  simulationLoading: boolean;
  simulationError: string | null;

  // ========== LOAN REQUEST STATE (WIZARD) ==========
  loanRequest: {
    currentStep: number;
    maxSteps: number;
    formData: Partial<LoanFormData>;
    score: number | null;
    isLoading: boolean;
    error: string | null;
  };

  // ========== CREDITOS STATE ==========
  creditos: Credito[];
  currentCredito: Credito | null;
  cuotas: Cuota[];
  estadisticas: ClienteEstadisticas | null;
  creditosLoading: boolean;
  creditosError: string | null;

  // ========== AUTH ACTIONS ==========
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => void;
  clearAuthError: () => void;

  // ========== SIMULATION ACTIONS ==========
  simulateLoan: (data: SimulationRequest) => Promise<boolean>;
  clearSimulation: () => void;
  loadSimulationHistory: () => Promise<void>;
  clearSimulationError: () => void;

  // ========== LOAN REQUEST ACTIONS (WIZARD) ==========
  setLoanFormData: (data: Partial<LoanFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitLoanRequest: () => Promise<boolean>;
  resetLoanWizard: () => void;

  // ========== CREDITOS ACTIONS ==========
  loadCreditos: () => Promise<void>;
  loadCreditoById: (id: number) => Promise<void>;
  loadEstadisticas: () => Promise<void>;
  createCredito: (data: LoanFormData) => Promise<boolean>;
  clearCreditosError: () => void;

  // ========== GLOBAL ACTIONS ==========
  reset: () => void;
}

// ==================== INITIAL STATE ====================

const initialLoanRequest = {
  currentStep: 1,
  maxSteps: 4,
  formData: {
    tipo_credito: 'CONSUMO' as TipoCredito,
    monto_solicitado: 0,
    plazo_meses: 12,
    tasa_interes: 0,
    motivo: '',
  },
  score: null,
  isLoading: false,
  error: null,
};

// ==================== ZUSTAND STORE ====================

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // ========== INITIAL STATE ==========
        token: null,
        user: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,

        currentSimulation: null,
        simulationHistory: [],
        simulationLoading: false,
        simulationError: null,

        loanRequest: initialLoanRequest,

        creditos: [],
        currentCredito: null,
        cuotas: [],
        estadisticas: null,
        creditosLoading: false,
        creditosError: null,

        // ========== AUTH ACTIONS ==========

        /**
         * Login user with email and password
         */
        login: async (data: LoginData): Promise<boolean> => {
          set({ authLoading: true, authError: null });

          try {
            const response = await api.auth.login(data);

            if (response.success && 'token' in response && response.token) {
              // Save token
              api.token.set(response.token);

              // Update state
              set({
                token: response.token,
                user: response.usuario || null,
                isAuthenticated: true,
                authLoading: false,
                authError: null,
              });

              return true;
            } else {
              set({
                authLoading: false,
                authError: response.message || 'Login failed',
              });
              return false;
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Login error';
            set({ authLoading: false, authError: message });
            return false;
          }
        },

        /**
         * Register a new user
         */
        register: async (data: RegisterData): Promise<boolean> => {
          set({ authLoading: true, authError: null });

          try {
            const response = await api.auth.register(data);

            if (response.success && 'token' in response && response.token) {
              // Save token
              api.token.set(response.token);

              // Update state
              set({
                token: response.token,
                user: response.usuario || null,
                isAuthenticated: true,
                authLoading: false,
                authError: null,
              });

              return true;
            } else {
              set({
                authLoading: false,
                authError: response.message || 'Registration failed',
              });
              return false;
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration error';
            set({ authLoading: false, authError: message });
            return false;
          }
        },

        /**
         * Logout user and clear all state
         */
        logout: () => {
          api.token.remove();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            authError: null,
            currentSimulation: null,
            simulationHistory: [],
            loanRequest: initialLoanRequest,
            creditos: [],
            currentCredito: null,
            cuotas: [],
            estadisticas: null,
          });
        },

        /**
         * Check if user is authenticated and load profile
         */
        checkAuth: async (): Promise<boolean> => {
          const token = api.token.get();

          if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return false;
          }

          set({ authLoading: true });

          try {
            const response = await api.auth.getProfile();

            if (response.success && 'usuario' in response) {
              set({
                token,
                user: response.usuario,
                isAuthenticated: true,
                authLoading: false,
                authError: null,
              });
              return true;
            } else {
              // Token invalid, logout
              get().logout();
              return false;
            }
          } catch (error) {
            get().logout();
            return false;
          }
        },

        /**
         * Update user profile data (optimistic update)
         */
        updateProfile: (userData: Partial<User>) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        },

        /**
         * Clear authentication error
         */
        clearAuthError: () => {
          set({ authError: null });
        },

        // ========== SIMULATION ACTIONS ==========

        /**
         * Simulate a loan and save result
         */
        simulateLoan: async (data: SimulationRequest): Promise<boolean> => {
          set({ simulationLoading: true, simulationError: null });

          try {
            const response = await api.simulation.simulate(data);

            if (response.success && 'simulacion' in response) {
              const simulation = response.simulacion;

              set((state) => ({
                currentSimulation: simulation,
                simulationHistory: [simulation, ...state.simulationHistory],
                simulationLoading: false,
                simulationError: null,
              }));

              return true;
            } else {
              set({
                simulationLoading: false,
                simulationError: response.message || 'Simulation failed',
              });
              return false;
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Simulation error';
            set({ simulationLoading: false, simulationError: message });
            return false;
          }
        },

        /**
         * Clear current simulation
         */
        clearSimulation: () => {
          set({ currentSimulation: null, simulationError: null });
        },

        /**
         * Load simulation history (requires auth)
         */
        loadSimulationHistory: async () => {
          if (!get().isAuthenticated) return;

          set({ simulationLoading: true });

          try {
            const response = await api.simulation.getHistory();

            if (response.success && 'simulaciones' in response) {
              set({
                simulationHistory: response.simulaciones || [],
                simulationLoading: false,
              });
            } else {
              set({ simulationLoading: false });
            }
          } catch (error) {
            set({ simulationLoading: false });
          }
        },

        /**
         * Clear simulation error
         */
        clearSimulationError: () => {
          set({ simulationError: null });
        },

        // ========== LOAN REQUEST ACTIONS (WIZARD) ==========

        /**
         * Update loan form data
         */
        setLoanFormData: (data: Partial<LoanFormData>) => {
          set((state) => ({
            loanRequest: {
              ...state.loanRequest,
              formData: { ...state.loanRequest.formData, ...data },
            },
          }));
        },

        /**
         * Go to next step in wizard
         */
        nextStep: () => {
          set((state) => {
            const nextStep = Math.min(
              state.loanRequest.currentStep + 1,
              state.loanRequest.maxSteps
            );
            return {
              loanRequest: { ...state.loanRequest, currentStep: nextStep },
            };
          });
        },

        /**
         * Go to previous step in wizard
         */
        prevStep: () => {
          set((state) => {
            const prevStep = Math.max(state.loanRequest.currentStep - 1, 1);
            return {
              loanRequest: { ...state.loanRequest, currentStep: prevStep },
            };
          });
        },

        /**
         * Go to specific step
         */
        goToStep: (step: number) => {
          set((state) => {
            const targetStep = Math.max(1, Math.min(step, state.loanRequest.maxSteps));
            return {
              loanRequest: { ...state.loanRequest, currentStep: targetStep },
            };
          });
        },

        /**
         * Submit loan request
         */
        submitLoanRequest: async (): Promise<boolean> => {
          const { formData } = get().loanRequest;

          // Validate form data
          if (
            !formData.tipo_credito ||
            !formData.monto_solicitado ||
            !formData.plazo_meses ||
            !formData.tasa_interes ||
            !formData.motivo
          ) {
            set((state) => ({
              loanRequest: {
                ...state.loanRequest,
                error: 'Please complete all required fields',
              },
            }));
            return false;
          }

          set((state) => ({
            loanRequest: { ...state.loanRequest, isLoading: true, error: null },
          }));

          try {
            const response = await api.credito.create(formData as LoanFormData);

            if (response.success) {
              // Reset wizard
              set({
                loanRequest: initialLoanRequest,
              });

              // Reload creditos
              await get().loadCreditos();

              return true;
            } else {
              set((state) => ({
                loanRequest: {
                  ...state.loanRequest,
                  isLoading: false,
                  error: response.message || 'Failed to submit loan request',
                },
              }));
              return false;
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Submission error';
            set((state) => ({
              loanRequest: {
                ...state.loanRequest,
                isLoading: false,
                error: message,
              },
            }));
            return false;
          }
        },

        /**
         * Reset loan wizard to initial state
         */
        resetLoanWizard: () => {
          set({ loanRequest: initialLoanRequest });
        },

        // ========== CREDITOS ACTIONS ==========

        /**
         * Load all creditos for current user
         */
        loadCreditos: async () => {
          if (!get().isAuthenticated) return;

          set({ creditosLoading: true, creditosError: null });

          try {
            const response = await api.credito.getAll();

            if (response.success && 'creditos' in response) {
              set({
                creditos: response.creditos || [],
                creditosLoading: false,
                creditosError: null,
              });
            } else {
              set({
                creditosLoading: false,
                creditosError: response.message || 'Failed to load loans',
              });
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Load error';
            set({ creditosLoading: false, creditosError: message });
          }
        },

        /**
         * Load specific credito by ID with amortization table
         */
        loadCreditoById: async (id: number) => {
          if (!get().isAuthenticated) return;

          set({ creditosLoading: true, creditosError: null });

          try {
            const response = await api.credito.getById(id);

            if (response.success && 'credito' in response) {
              set({
                currentCredito: response.credito,
                cuotas: response.tabla_amortizacion || [],
                creditosLoading: false,
                creditosError: null,
              });
            } else {
              const errorMsg = 'message' in response ? response.message : 'Failed to load loan details';
              set({
                creditosLoading: false,
                creditosError: errorMsg,
              });
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Load error';
            set({ creditosLoading: false, creditosError: message });
          }
        },

        /**
         * Load client statistics
         */
        loadEstadisticas: async () => {
          if (!get().isAuthenticated) return;

          try {
            const response = await api.credito.getStatistics();

            if (response.success && 'estadisticas' in response) {
              set({ estadisticas: response.estadisticas });
            }
          } catch (error) {
            console.error('Failed to load statistics:', error);
          }
        },

        /**
         * Create new credito
         */
        createCredito: async (data: LoanFormData): Promise<boolean> => {
          set({ creditosLoading: true, creditosError: null });

          try {
            const response = await api.credito.create(data);

            if (response.success) {
              // Reload creditos list
              await get().loadCreditos();
              return true;
            } else {
              set({
                creditosLoading: false,
                creditosError: response.message || 'Failed to create loan',
              });
              return false;
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Creation error';
            set({ creditosLoading: false, creditosError: message });
            return false;
          }
        },

        /**
         * Clear creditos error
         */
        clearCreditosError: () => {
          set({ creditosError: null });
        },

        // ========== GLOBAL ACTIONS ==========

        /**
         * Reset entire store to initial state
         */
        reset: () => {
          api.token.remove();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            authLoading: false,
            authError: null,
            currentSimulation: null,
            simulationHistory: [],
            simulationLoading: false,
            simulationError: null,
            loanRequest: initialLoanRequest,
            creditos: [],
            currentCredito: null,
            cuotas: [],
            estadisticas: null,
            creditosLoading: false,
            creditosError: null,
          });
        },
      }),
      {
        name: 'aurora-prive-storage',
        partialize: (state) => ({
          // Only persist token and user
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          simulationHistory: state.simulationHistory,
        }),
      }
    ),
    {
      name: 'Aurora Privé Store',
    }
  )
);

// ==================== SELECTORS ====================

/**
 * Custom hooks for specific state selections
 */

export const useAuth = () =>
  useStore((state) => ({
    token: state.token,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.authLoading,
    error: state.authError,
    login: state.login,
    register: state.register,
    logout: state.logout,
    checkAuth: state.checkAuth,
    clearError: state.clearAuthError,
  }));

export const useSimulation = () =>
  useStore((state) => ({
    current: state.currentSimulation,
    history: state.simulationHistory,
    isLoading: state.simulationLoading,
    error: state.simulationError,
    simulate: state.simulateLoan,
    clear: state.clearSimulation,
    loadHistory: state.loadSimulationHistory,
    clearError: state.clearSimulationError,
  }));

export const useLoanWizard = () =>
  useStore((state) => ({
    currentStep: state.loanRequest.currentStep,
    maxSteps: state.loanRequest.maxSteps,
    formData: state.loanRequest.formData,
    score: state.loanRequest.score,
    isLoading: state.loanRequest.isLoading,
    error: state.loanRequest.error,
    setFormData: state.setLoanFormData,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    goToStep: state.goToStep,
    submit: state.submitLoanRequest,
    reset: state.resetLoanWizard,
  }));

export const useCreditos = () =>
  useStore((state) => ({
    creditos: state.creditos,
    current: state.currentCredito,
    cuotas: state.cuotas,
    estadisticas: state.estadisticas,
    isLoading: state.creditosLoading,
    error: state.creditosError,
    loadAll: state.loadCreditos,
    loadById: state.loadCreditoById,
    loadStats: state.loadEstadisticas,
    create: state.createCredito,
    clearError: state.clearCreditosError,
  }));

export default useStore;
