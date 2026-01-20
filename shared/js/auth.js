/**
 * Fragment Games - Authentication System
 * Handles email registration and Agent ID generation
 */

// Generate unique Agent ID from email
function generateAgentId(email) {
    const hash = simpleHash(email);
    const prefix = "AGENT";
    const suffix = hash.toString(16).toUpperCase().slice(0, 6);
    return `${prefix}-${suffix}`;
}

// Simple hash function
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Register new agent
function registerAgent(email) {
    if (!email || !email.includes('@')) {
        throw new Error('Invalid email address');
    }

    const agentId = generateAgentId(email);
    const agent = {
        id: agentId,
        email: email,
        registeredAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem('currentAgent', JSON.stringify(agent));
    localStorage.setItem(`agent_${agentId}`, JSON.stringify(agent));

    // TODO: Send email with Agent ID (requires backend)
    console.log('Agent registered:', agent);

    return agent;
}

// Get current agent
function getAgent() {
    const agentData = localStorage.getItem('currentAgent');
    if (!agentData) {
        return null;
    }

    const agent = JSON.parse(agentData);

    // Update last active
    agent.lastActive = new Date().toISOString();
    localStorage.setItem('currentAgent', JSON.stringify(agent));

    return agent;
}

// Check if agent is logged in
function isLoggedIn() {
    return getAgent() !== null;
}

// Logout agent
function logoutAgent() {
    localStorage.removeItem('currentAgent');
}

// Get agent by ID
function getAgentById(agentId) {
    const agentData = localStorage.getItem(`agent_${agentId}`);
    return agentData ? JSON.parse(agentData) : null;
}

// Get all agents (admin function)
function getAllAgents() {
    const agents = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('agent_')) {
            const agent = JSON.parse(localStorage.getItem(key));
            agents.push(agent);
        }
    }
    return agents;
}

// Verify email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        registerAgent,
        getAgent,
        isLoggedIn,
        logoutAgent,
        getAgentById,
        getAllAgents,
        isValidEmail,
        generateAgentId
    };
}
