const fs = require('fs');
const path = require('path');

const SIGNAL_WEIGHTS = {
  'recurring_error': 10,
  'error': 8,
  'log_error': 7,
  'user_improvement_suggestion': 6,
  'capability_gap': 5,
  'perf_bottleneck': 4,
  'stable_success_plateau': 3,
  'empty_cycle_loop_detected': 3,
  'force_steady_state': 2,
  'evolution_saturation': 2,
  'evolution_stagnation_detected': 2
};

function prioritize(signals) {
  const scores = signals.map(sig => ({
    signal: sig,
    weight: SIGNAL_WEIGHTS[sig] || 1,
    priority: 'low'
  }));
  
  scores.forEach(s => {
    if (s.weight >= 7) s.priority = 'critical';
    else if (s.weight >= 4) s.priority = 'high';
    else if (s.weight >= 2) s.priority = 'medium';
  });
  
  return scores.sort((a, b) => b.weight - a.weight);
}

module.exports = { 
  prioritize,
  main: () => {
    const testSignals = [
      'evolution_stagnation_detected',
      'stable_success_plateau', 
      'empty_cycle_loop_detected',
      'force_steady_state',
      'evolution_saturation'
    ];
    const result = prioritize(testSignals);
    console.log('### 🎯 Signal Prioritization');
    result.forEach(s => console.log(`  [${s.priority.toUpperCase()}] ${s.signal}: ${s.weight}`));
    return result;
  }
};
