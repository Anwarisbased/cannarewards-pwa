'use client';

import { useAuth } from '../context/AuthContext';
import DashboardSkeleton from './DashboardSkeleton';
import PageContainer from './PageContainer';
import StatusCard from './dashboard/StatusCard';
import ActionCard from './dashboard/ActionCard';
import NextActionCarousel from './dashboard/NextActionCarousel';

/**
 * The main user dashboard, refactored to be a "Mission Control" hub.
 * It assembles modular cards to present a user-centric view of their status and actions.
 */
export default function Dashboard() {
  const { user, loading } = useAuth();

  // Show a skeleton while the user data is loading to prevent layout shifts.
  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    // We use PageContainer to ensure consistent padding and safe-area handling,
    // matching the rest of the authenticated app experience.
    <PageContainer>
        <div className="space-y-6">
            {/* 1. The user's current status, at the top */}
            <StatusCard user={user} />

            {/* 2. The primary actions, right below for immediate access */}
            <ActionCard />

            {/* 3. The dynamic, personalized suggestions carousel */}
            <NextActionCarousel user={user} />
        </div>
    </PageContainer>
  );
}