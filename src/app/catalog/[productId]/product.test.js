import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSearchParams, useParams } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import api from '@/utils/axiosConfig';
import ProductDetailPage from './page';

// Mock dependencies
const mockUseAuth = jest.fn();
const mockUseModal = jest.fn();
const mockRouterPush = jest.fn();
const mockRouterBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush, back: mockRouterBack }),
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  ...jest.requireActual('@/context/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/context/ModalContext', () => ({
  ...jest.requireActual('@/context/ModalContext'),
  useModal: () => mockUseModal(),
}));

jest.mock('@/utils/axiosConfig');

// Custom render function
const renderProductDetailPage = () => {
  return render(
    <ModalProvider>
      <AuthProvider>
        <ProductDetailPage />
      </AuthProvider>
    </ModalProvider>
  );
};

// Mock product data
const mockProduct = {
  id: 123,
  name: 'Awesome Reward Hat',
  images: [{ src: 'hat.jpg' }],
  description: 'A very cool hat for redeeming.',
  meta_data: [{ key: 'points_cost', value: '500' }],
};

describe('ProductDetailPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockProduct });
  });

  // --- NEW BULLETPROOF HELPER ---
  const waitForDataToLoad = async () => {
    await waitFor(() => {
      // Wait for the skeleton to be REMOVED from the document
      expect(screen.queryByTestId('product-detail-skeleton')).not.toBeInTheDocument();
    });
  };

  it('should trigger celebration and show special UI for a first scan', async () => {
    useParams.mockReturnValue({ productId: '123' });
    useSearchParams.mockReturnValue(new URLSearchParams('?first_scan=true'));
    const mockTriggerCelebration = jest.fn();
    mockUseModal.mockReturnValue({ triggerCelebration: mockTriggerCelebration });
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, user: { points: 1000 } });

    renderProductDetailPage();
    
    expect(mockTriggerCelebration).toHaveBeenCalledTimes(1);
    
    await waitForDataToLoad();

    expect(screen.getByText('Awesome Reward Hat')).toBeInTheDocument();
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Claim Your Welcome Gift!/i })).toBeInTheDocument();
  });

  it('should show standard redeem button when user can afford the reward', async () => {
    useParams.mockReturnValue({ productId: '123' });
    useSearchParams.mockReturnValue(new URLSearchParams(''));
    mockUseModal.mockReturnValue({ triggerCelebration: jest.fn() });
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, user: { points: 600 } });

    renderProductDetailPage();
    await waitForDataToLoad();

    const redeemButton = screen.getByRole('button', { name: /Redeem for 500 Points/i });
    expect(redeemButton).toBeInTheDocument();
    expect(redeemButton).not.toBeDisabled();
  });

  it('should show a disabled button when user cannot afford the reward', async () => {
    useParams.mockReturnValue({ productId: '123' });
    useSearchParams.mockReturnValue(new URLSearchParams(''));
    mockUseModal.mockReturnValue({ triggerCelebration: jest.fn() });
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, user: { points: 100 } });

    renderProductDetailPage();
    await waitForDataToLoad();

    const redeemButton = screen.getByRole('button', { name: /Earn 400 more points/i });
    expect(redeemButton).toBeInTheDocument();
    expect(redeemButton).toBeDisabled();
  });

  it('should open the shipping modal when an eligible user clicks redeem', async () => {
    useParams.mockReturnValue({ productId: '123' });
    useSearchParams.mockReturnValue(new URLSearchParams(''));
    mockUseModal.mockReturnValue({ triggerCelebration: jest.fn() });
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false, user: { points: 600 } });

    renderProductDetailPage();
    await waitForDataToLoad();
    
    expect(screen.queryByText('Enter Shipping Details')).not.toBeInTheDocument();

    const redeemButton = screen.getByRole('button', { name: /Redeem for 500 Points/i });
    fireEvent.click(redeemButton);

    expect(screen.getByText('Enter Shipping Details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save & Redeem/i })).toBeInTheDocument();
  });
});