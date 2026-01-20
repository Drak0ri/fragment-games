/**
 * Fragment Games - Scanner Integration
 * Handles RFID and Barcode scanning via USB devices
 */

let rfidCallback = null;
let barcodeCallback = null;
let scanBuffer = '';
let scanTimeout = null;

/**
 * Initialize RFID scanner
 * Scanner acts as keyboard input device
 */
function initRFIDScanner(callback) {
    rfidCallback = callback;

    // Listen for keyboard input (RFID scanners type their data)
    document.addEventListener('keypress', handleScannerInput);

    console.log('RFID Scanner initialized');
}

/**
 * Initialize Barcode scanner
 */
function initBarcodeScanner(callback) {
    barcodeCallback = callback;

    // Barcode scanner also uses keyboard input
    document.addEventListener('keypress', handleScannerInput);

    console.log('Barcode Scanner initialized');
}

/**
 * Handle scanner input
 * Scanners send rapid keyboard input followed by Enter
 */
function handleScannerInput(event) {
    // Clear previous timeout
    if (scanTimeout) {
        clearTimeout(scanTimeout);
    }

    // If Enter key, process the scan
    if (event.key === 'Enter' && scanBuffer.length > 0) {
        processScan(scanBuffer);
        scanBuffer = '';
        return;
    }

    // Ignore if typing in input field
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    // Add character to buffer
    scanBuffer += event.key;

    // Auto-process after 100ms of no input (scanner finished)
    scanTimeout = setTimeout(() => {
        if (scanBuffer.length > 0) {
            processScan(scanBuffer);
            scanBuffer = '';
        }
    }, 100);
}

/**
 * Process scanned data
 */
function processScan(data) {
    console.log('Scan detected:', data);

    // Determine if RFID or Barcode based on format
    if (data.startsWith('FRAG-') || data.startsWith('RFID-')) {
        // RFID tag
        if (rfidCallback) {
            rfidCallback(data);
        }
        showScanFeedback('RFID', data);
    } else if (data.startsWith('BAR-') || data.match(/^\d{8,}$/)) {
        // Barcode
        if (barcodeCallback) {
            barcodeCallback(data);
        }
        showScanFeedback('BARCODE', data);
    } else {
        console.log('Unknown scan format:', data);
    }
}

/**
 * Show visual feedback for scan
 */
function showScanFeedback(type, data) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 0, 0.9);
        color: #000;
        padding: 15px 25px;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        animation: slideIn 0.3s ease-out;
    `;
    feedback.textContent = `✓ ${type} SCANNED`;

    document.body.appendChild(feedback);

    // Play beep sound (if available)
    playBeep();

    // Remove after 2 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

/**
 * Play beep sound for scan confirmation
 */
function playBeep() {
    // Create audio context for beep
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not available');
    }
}

/**
 * Simulate RFID scan (for testing without hardware)
 */
function simulateRFIDScan(tagId) {
    processScan(tagId);
}

/**
 * Simulate Barcode scan (for testing without hardware)
 */
function simulateBarcodeScan(barcode) {
    processScan(barcode);
}

/**
 * Get tag info from RFID tag ID
 */
function getTagInfo(tagId) {
    // Parse tag format: FRAG-01, FRAG-02, etc.
    const match = tagId.match(/FRAG-(\d+)/);
    if (match) {
        return {
            type: 'fragment',
            number: parseInt(match[1]),
            id: tagId
        };
    }

    return {
        type: 'unknown',
        id: tagId
    };
}

/**
 * Validate scan against daily limits
 */
function canScanToday(agentId, scanType = 'rfid') {
    const today = new Date().toDateString();
    const key = `scans_${scanType}_${agentId}_${today}`;
    const scans = parseInt(localStorage.getItem(key) || '0');

    const limits = {
        rfid: 3,
        barcode: 10
    };

    return scans < (limits[scanType] || 999);
}

/**
 * Record scan
 */
function recordScan(agentId, scanType, scanData) {
    const today = new Date().toDateString();
    const key = `scans_${scanType}_${agentId}_${today}`;
    const scans = parseInt(localStorage.getItem(key) || '0');

    localStorage.setItem(key, (scans + 1).toString());

    // Also record in scan history
    const historyKey = `scan_history_${agentId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.push({
        type: scanType,
        data: scanData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem(historyKey, JSON.stringify(history));
}

/**
 * Get today's scan count
 */
function getTodayScans(agentId, scanType = 'rfid') {
    const today = new Date().toDateString();
    const key = `scans_${scanType}_${agentId}_${today}`;
    return parseInt(localStorage.getItem(key) || '0');
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRFIDScanner,
        initBarcodeScanner,
        simulateRFIDScan,
        simulateBarcodeScan,
        getTagInfo,
        canScanToday,
        recordScan,
        getTodayScans
    };
}
