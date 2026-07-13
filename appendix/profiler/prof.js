// ============================================
// REAL-TIME FPS METER (Median + 1% / 0.1% Lows)
// ============================================

let frameDurations = []; // Stores each frame's duration in milliseconds
let lastTime = performance.now();
let rafId;

// Sampling loop - collects frame durations
function measureLoop(now) {
    const delta = now - lastTime;
    if (delta > 0) {
        frameDurations.push(delta);
        // Keep last 10000 frames (~160 seconds at 60fps)
        // Ensures 0.1% low has at least 1 data point
        if (frameDurations.length > 10000) frameDurations.shift();
    }
    lastTime = now;
    rafId = requestAnimationFrame(measureLoop);
}

// Start the measurement
requestAnimationFrame(measureLoop);

// ============================================
// STATS CALCULATOR (Run this anytime)
// ============================================
function getFPSStats() {
    const total = frameDurations.length;
    if (total === 0) return "No frames recorded yet. Wait a moment...";

    // --- Current & Average FPS ---
    const currentFPS = 1000 / frameDurations[frameDurations.length - 1];
    const avgDuration = frameDurations.reduce((a, b) => a + b, 0) / total;
    const avgFPS = 1000 / avgDuration;

    // --- Sort durations: DESCENDING (slowest first) for Lows ---
    const sortedDesc = [...frameDurations].sort((a, b) => b - a);

    // --- Median (50th percentile) Duration ---
    const medianDuration = sortedDesc[Math.floor(total / 2)];
    const medianFPS = 1000 / medianDuration;


    // --- 1% Low (slowest 1% of frames) ---
    const p1Count = Math.max(1, Math.floor(total * 0.01));
    const p1AvgDuration = sortedDesc.slice(0, p1Count).reduce((a, b) => a + b, 0) / p1Count;
    const p1LowFPS = 1000 / p1AvgDuration;

    // --- 0.1% Low (slowest 0.1% of frames) ---
    const p01Count = Math.max(1, Math.floor(total * 0.001));
    const p01AvgDuration = sortedDesc.slice(0, p01Count).reduce((a, b) => a + b, 0) / p01Count;
    const p01LowFPS = 1000 / p01AvgDuration;

    // --- Return Results ---
    return {
        "Average FPS": avgFPS.toFixed(1),
        "Median FPS": medianFPS.toFixed(1),
        "1% Low FPS": p1LowFPS.toFixed(1),
        "0.1% Low FPS": p01LowFPS.toFixed(1),
        "Frames Sampled": total
    };
}

// --- Display stats in a neat table ---
console.table(getFPSStats());

// --- To stop measuring, run: cancelAnimationFrame(rafId) ---