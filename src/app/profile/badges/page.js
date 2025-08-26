'use client';

import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BadgesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!user) {
    // This should ideally be handled by a higher-order component or middleware
    // that redirects to login if not authenticated.
    return <p className="text-center mt-8">Please log in to view your achievements.</p>;
  }

  const { allAchievements, unlockedAchievementKeys } = user;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Trophy Case</h1>
      <p className="text-center text-gray-600 mb-8">Tap any badge to see its details.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allAchievements && allAchievements.map(achievement => (
          <Badge
            key={achievement.achievement_key}
            achievement={achievement}
            isUnlocked={unlockedAchievementKeys.includes(achievement.achievement_key)}
          />
        ))}
      </div>

      {(!allAchievements || allAchievements.length === 0) && (
        <p className="text-center mt-8 text-gray-500">No achievements are available yet. Check back soon!</p>
      )}
    </div>
  );
}