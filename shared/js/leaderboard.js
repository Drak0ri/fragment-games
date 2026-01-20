/**
 * Fragment Games - Leaderboard System
 * Handles ranking and statistics across all games
 */

/**
 * Get leaderboard for specific game
 */
function getLeaderboard(gameId, limit = 10) {
    const players = [];

    // Scan localStorage for all player data for this game
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${gameId}_`)) {
            const agentId = key.replace(`${gameId}_`, '');
            const gameData = JSON.parse(localStorage.getItem(key));

            // Calculate score based on progress
            const score = calculateScore(gameData, gameId);

            players.push({
                agentId: agentId,
                score: score,
                fragmentsFound: gameData.fragments ? gameData.fragments.filter(f => f).length : 0,
                currency: gameData.currency || 0,
                lastActive: gameData.lastActive || new Date().toISOString()
            });
        }
    }

    // Sort by score (descending), then by currency
    players.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.currency - a.currency;
    });

    // Return top N players
    return players.slice(0, limit);
}

/**
 * Calculate score based on game progress
 */
function calculateScore(gameData, gameId) {
    let score = 0;

    // Base score from fragments
    if (gameData.fragments) {
        const fragmentsFound = gameData.fragments.filter(f => f).length;
        score += fragmentsFound * 100;
    }

    // Bonus for completion
    if (gameData.fragments && gameData.fragments.every(f => f)) {
        score += 500;
    }

    // Add currency
    score += (gameData.currency || 0);

    return score;
}

/**
 * Get player rank
 */
function getPlayerRank(agentId, gameId) {
    const leaderboard = getLeaderboard(gameId, 999);
    const rank = leaderboard.findIndex(p => p.agentId === agentId);
    return rank === -1 ? null : rank + 1;
}

/**
 * Get global stats
 */
function getGlobalStats(gameId) {
    const players = getLeaderboard(gameId, 999);

    if (players.length === 0) {
        return {
            totalPlayers: 0,
            averageProgress: 0,
            totalCompletions: 0,
            topScore: 0
        };
    }

    const totalFragments = players.reduce((sum, p) => sum + p.fragmentsFound, 0);
    const completions = players.filter(p => p.fragmentsFound === 20).length;

    return {
        totalPlayers: players.length,
        averageProgress: Math.round(totalFragments / players.length),
        totalCompletions: completions,
        topScore: players[0]?.score || 0
    };
}

/**
 * Get player stats
 */
function getPlayerStats(agentId, gameId) {
    const gameData = localStorage.getItem(`${gameId}_${agentId}`);
    if (!gameData) {
        return null;
    }

    const data = JSON.parse(gameData);
    const rank = getPlayerRank(agentId, gameId);

    return {
        agentId: agentId,
        rank: rank,
        fragmentsFound: data.fragments ? data.fragments.filter(f => f).length : 0,
        currency: data.currency || 0,
        hints: data.hints || 0,
        skips: data.skips || 0,
        score: calculateScore(data, gameId)
    };
}

/**
 * Update leaderboard display
 */
function updateLeaderboardDisplay(containerId, gameId, currentAgentId = null, limit = 10) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const leaderboard = getLeaderboard(gameId, limit);

    if (leaderboard.length === 0) {
        container.innerHTML = '<div style="text-align: center; opacity: 0.5;">No players yet</div>';
        return;
    }

    container.innerHTML = leaderboard.map((player, index) => {
        const isCurrentPlayer = player.agentId === currentAgentId;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

        return `
            <div class="leaderboard-entry ${isCurrentPlayer ? 'you' : ''}" style="
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin: 5px 0;
                background: ${isCurrentPlayer ? 'rgba(0, 100, 0, 0.3)' : 'rgba(0, 30, 0, 0.5)'};
                border-left: 3px solid ${isCurrentPlayer ? '#ffff00' : '#00ff00'};
            ">
                <span>${medal} #${index + 1} ${player.agentId}${isCurrentPlayer ? ' (YOU)' : ''}</span>
                <span>${player.fragmentsFound}/20 | ${player.score} pts</span>
            </div>
        `;
    }).join('');
}

/**
 * Get achievements
 */
function getAchievements(agentId, gameId) {
    const gameData = localStorage.getItem(`${gameId}_${agentId}`);
    if (!gameData) {
        return [];
    }

    const data = JSON.parse(gameData);
    const achievements = [];

    // First fragment
    if (data.fragments && data.fragments.filter(f => f).length >= 1) {
        achievements.push({ id: 'first_fragment', name: 'First Steps', icon: '🌟' });
    }

    // 5 fragments
    if (data.fragments && data.fragments.filter(f => f).length >= 5) {
        achievements.push({ id: 'quarter', name: 'Quarter Way', icon: '⭐' });
    }

    // 10 fragments
    if (data.fragments && data.fragments.filter(f => f).length >= 10) {
        achievements.push({ id: 'halfway', name: 'Halfway There', icon: '🎯' });
    }

    // 15 fragments
    if (data.fragments && data.fragments.filter(f => f).length >= 15) {
        achievements.push({ id: 'almost', name: 'Almost Done', icon: '🔥' });
    }

    // All fragments
    if (data.fragments && data.fragments.every(f => f)) {
        achievements.push({ id: 'complete', name: 'Mission Complete', icon: '🏆' });
    }

    // Currency milestones
    if (data.currency >= 50) {
        achievements.push({ id: 'rich', name: 'Wealthy Agent', icon: '💰' });
    }

    // Mini-game master
    if (data.miniGamesPlayed >= 10) {
        achievements.push({ id: 'gamer', name: 'Mini-Game Master', icon: '🎮' });
    }

    return achievements;
}

/**
 * Export leaderboard data (admin function)
 */
function exportLeaderboardCSV(gameId) {
    const leaderboard = getLeaderboard(gameId, 999);

    const csv = [
        'Rank,Agent ID,Score,Fragments,Currency',
        ...leaderboard.map((player, index) =>
            `${index + 1},${player.agentId},${player.score},${player.fragmentsFound},${player.currency}`
        )
    ].join('\n');

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameId}_leaderboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLeaderboard,
        getPlayerRank,
        getGlobalStats,
        getPlayerStats,
        updateLeaderboardDisplay,
        getAchievements,
        exportLeaderboardCSV
    };
}
