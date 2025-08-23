'use client';

/**
 * Calculates a user's progress towards their next rank.
 * @param {object} user The user object from the AuthContext.
 * @returns {object} An object containing nextRank, progressPercentage, and pointsNeeded.
 */
export function calculateRankProgress(user) {
    if (!user || !user.allRanks || user.lifetimePoints === null || user.lifetimePoints === undefined) {
        return { nextRank: null, progressPercentage: 0, pointsNeeded: 0 };
    }

    // --- THIS IS THE FIX ---
    // The utility now sorts the ranks itself, ensuring it always works correctly
    // regardless of the order it receives them in.
    const sortedRanksAsc = Object.values(user.allRanks).sort((a, b) => a.points - b.points);
    
    let nextRank = null;
    let currentRankPoints = 0;

    // Iterate through the ranks sorted from LOWEST to HIGHEST
    for (const rank of sortedRanksAsc) {
        if (user.lifetimePoints < rank.points) {
            // This is the first rank the user has NOT yet achieved. This is their "nextRank".
            nextRank = rank;
            break; 
        }
        // If the user has enough points for this rank, we update the floor for our calculation.
        currentRankPoints = rank.points;
    }

    // --- The rest of the logic is now correct because the inputs are sorted correctly ---
    if (nextRank) {
        const pointsInCurrentTier = user.lifetimePoints - currentRankPoints;
        const pointsForNextTier = nextRank.points - currentRankPoints;

        if (pointsForNextTier <= 0) {
            return { nextRank, progressPercentage: 100, pointsNeeded: 0 };
        }

        const progressPercentage = (pointsInCurrentTier / pointsForNextTier) * 100;
        const pointsNeeded = nextRank.points - user.lifetimePoints;
        
        return { nextRank, progressPercentage, pointsNeeded };
    }

    // If no nextRank was found, it means the user is at the highest tier.
    return { nextRank: null, progressPercentage: 100, pointsNeeded: 0 };
}