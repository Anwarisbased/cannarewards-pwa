import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import RegisterForm from './RegisterForm';
import api from '@/utils/axiosConfig';

// Mock dependencies
const mockRouterPush = jest.fn();
const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// We only need to mock useAuth for the login call, so we do it simply.
jest.mock('@/context/AuthContext', () => ({
  ...jest.requireActual('@/context/AuthContext'),
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('@/utils/axiosConfig');

const renderRegisterForm = (props) => {
  return render(
    // We don't need the full provider suite if we mock useAuth this way
    <RegisterForm {...props} />
  );
};

// Mock data for the incentivized flow
const mockRewardPreview = {
  productId: 1,
  name: 'Incentive Reward',
  image: 'incentive.jpg',
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock a successful API response for login and register
    api.post.mockResolvedValue({ data: { token: 'new-fake-token' } });
  });

  // Test Case 1: Standard Mode
  it('should render the standard form and not show a reward preview', () => {
    const mockSwitch = jest.fn();
    renderRegisterForm({ onSwitchToLogin: mockSwitch });

    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    // Verify the reward preview is NOT there
    expect(screen.queryByText('YOUR WELCOME REWARD')).not.toBeInTheDocument();
    // Verify the "switch to login" button is there
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  // Test Case 2: Incentivized Mode
  it('should render with a reward preview and hide the switch to login button', () => {
    renderRegisterForm({ claimCode: 'SCAN123', rewardPreview: mockRewardPreview });
    
    expect(screen.getByText('YOUR WELCOME REWARD')).toBeInTheDocument();
    expect(screen.getByText('Incentive Reward')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Log In/i })).not.toBeInTheDocument();
  });

  // Test Case 3: Successful Submission in Incentivized Mode
  it('should submit with the claimCode and redirect to the product page', async () => {
    renderRegisterForm({ claimCode: 'SCAN123', rewardPreview: mockRewardPreview });

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByLabelText(/I agree to the/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign Up & Claim Reward/i }));

    // Wait for the async submission to complete
    await waitFor(() => {
      // 1. Verify the register endpoint was called with the correct payload, including the code
      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('/rewards/v1/register'),
        expect.objectContaining({
          email: 'test@example.com',
          firstName: 'Test',
          code: 'SCAN123', // <-- The important part
        }),
        expect.any(Object)
      );
    });

    // 2. Verify the login function was called
    expect(mockLogin).toHaveBeenCalledWith('new-fake-token');

    // 3. Verify the redirect was to the correct product page with the special flag
    expect(mockRouterPush).toHaveBeenCalledWith('/catalog/1?first_scan=true');
  });
});