'use client';

/**
 * Calculates a user's progress towards their next rank.
 * @param {object} user The user object from the AuthContext.
 * @returns {object} An object containing nextRank, progressPercentage, and pointsNeeded.
 */
export function calculateRankProgress(user) {
    // A "guard clause" to handle cases where user data might not be loaded yet.
    if (!user || !user.allRanks || !user.lifetimePoints) {
        return { nextRank: null, progressPercentage: 0, pointsNeeded: 0 };
    }

    // Ranks from the API are an object, so we convert to an array and sort by points ascending.
    const sortedRanks = Object.values(user.allRanks).sort((a, b) => a.points - b.points);
    
    let nextRank = null;
    let currentRankPoints = 0;

    // Iterate through the sorted ranks to find where the user currently stands.
    for (const rank of sortedRanks) {
        if (user.lifetimePoints < rank.points) {
            // This is the first rank the user has NOT yet achieved. This is their "nextRank".
            nextRank = rank;
            break;
        }
        // If the user has enough points for this rank, we update the floor for our calculation.
        currentRankPoints = rank.points;
    }

    // If a nextRank was found, calculate the progress towards it.
    if (nextRank) {
        const pointsInCurrentTier = user.lifetimePoints - currentRankPoints;
        const pointsForNextTier = nextRank.points - currentRankPoints;

        // Avoid division by zero if ranks have the same point value.
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