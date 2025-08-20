import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import api from '@/utils/axiosConfig';
import ClaimPage from './page';

// --- A more robust way to mock modules ---
// This tells Jest to get the real module, and then we'll override specific parts.
const mockUseAuth = jest.fn();
const mockUseModal = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  ...jest.requireActual('@/context/AuthContext'), // Import the actual module
  useAuth: () => mockUseAuth(), // Override just the useAuth hook
}));

jest.mock('@/context/ModalContext', () => ({
  ...jest.requireActual('@/context/ModalContext'), // Import the actual module
  useModal: () => mockUseModal(), // Override just the useModal hook
}));

jest.mock('@/utils/axiosConfig');


// The custom render function uses the real providers.
const renderClaimPageWithProviders = () => {
  return render(
    <ModalProvider>
      <AuthProvider>
        <ClaimPage />
      </AuthProvider>
    </ModalProvider>
  );
};


describe('ClaimPage', () => {

  beforeEach(() => {
    // Reset mocks before each test
    mockUseAuth.mockClear();
    mockUseModal.mockClear();
    api.get.mockClear();
    api.post.mockClear();
    // Clear any localStorage mocks
    jest.restoreAllMocks();
  });

  it('should show the welcome screen for an unauthenticated user', async () => {
    // --- ARRANGE ---
    useSearchParams.mockReturnValue(new URLSearchParams('?code=VALIDCODE123'));
    
    // Set the return value for our mocked hooks for this specific test
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });
    mockUseModal.mockReturnValue({
      triggerCelebration: jest.fn(),
    });

    const mockReward = {
      productId: 1,
      name: 'The Coolest Hat',
      image: 'hat.jpg',
    };
    api.get.mockResolvedValue({ data: mockReward });

    // --- ACT ---
    renderClaimPageWithProviders();

    // --- ASSERT ---
    await waitFor(() => {
      expect(screen.getByText("You've Unlocked a Reward!")).toBeInTheDocument();
    });

    expect(screen.getByText('The Coolest Hat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account to Claim/i })).toBeInTheDocument();
  });

  it('should claim the code directly for an authenticated user', async () => {
    // --- ARRANGE ---
    useSearchParams.mockReturnValue(new URLSearchParams('?code=AUTHENTICATEDCODE'));
    
    // --- Set up mock localStorage ---
    const fakeToken = 'fake-auth-token';
    // Use jest.spyOn for a cleaner, restorable mock
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') {
        return fakeToken;
      }
      return null;
    });

    const mockLogin = jest.fn().mockResolvedValue(true);
    const mockTriggerCelebration = jest.fn();

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: mockLogin,
    });
    mockUseModal.mockReturnValue({
      triggerCelebration: mockTriggerCelebration,
    });
    
    api.post.mockResolvedValue({ data: { success: true } });

    // --- ACT ---
    renderClaimPageWithProviders();

    // --- ASSERT ---
    expect(screen.getByText('Processing Your Reward...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('/rewards/v1/claim'),
        { code: 'AUTHENTICATEDCODE' }
      );
    });
    
    expect(mockLogin).toHaveBeenCalledWith(fakeToken, true);
    expect(mockTriggerCelebration).toHaveBeenCalled();
  });
});