# 机器可读状态参数

> **用途**：状态评估和路由决策时加载此文件

---

## 📊 能量模式定义

```yaml
energy_patterns:
  baseline:
    optimal_sleep: "7-8h"
    sleep_fragility: HIGH  # 对睡眠不足敏感
    recovery_rate: MODERATE  # 恢复需要时间
    
  risk_factors:
    - consecutive_sleep_deficit  # 连续睡眠不足
    - high_emotional_density     # 高情绪密度
    - task_switching_frequency   # 频繁任务切换
    
  protective_factors:
    - routine_stability         # 规律作息
    - cognitive_offloading      # 认知卸载（外部系统）
    - social_boundary_setting   # 社交边界设定
```

---

## 🎭 情绪模式定义

```yaml
mood_patterns:
  bipolar_spectrum:
    status: HISTORICAL  # 历史存在，当前管理中
    monitoring: REQUIRED
    
  triggers:
    negative:
      - sleep_deprivation
      - unresolved_conflict
      - decision_overload
      - physical_illness
    positive:
      - creative_engagement
      - meaningful_progress
      - quality_rest
      
  warning_signs:
    hypo_mania:
      - decreased_sleep_need
      - racing_thoughts
      - increased_productivity_urge
    depressive:
      - withdrawal
      - decision_paralysis
      - self_criticism_spike
```

---

## 🧠 认知模式定义

```yaml
cognitive_patterns:
  strengths:
    - pattern_recognition: HIGH
    - visual_thinking: HIGH
    - conceptual_abstraction: HIGH
    - strategic_thinking: MODERATE-HIGH
    
  challenges:
    - sequential_text_processing: LOW  # 阅读障碍特征
    - sustained_attention: MODERATE
    - working_memory_load: MODERATE
    
  preferences:
    - structured_information
    - visual_representations
    - progressive_disclosure
    - fact_based_reasoning
```

---

## 🔀 路由参数

```yaml
routing:
  complexity_threshold:
    simple: "<= 3 steps"
    moderate: "4-7 steps"
    complex: "> 7 steps"
    
  load_methodology_when:
    - complexity >= moderate
    - decision_stakes: HIGH
    - multiple_stakeholders: true
    - reversibility: LOW
    
  load_facts_when:
    - context_needed: true
    - pattern_matching_required: true
    - historical_reference: requested
```

---

## 🚩 风险标志

```yaml
risk_flags:
  immediate_attention:
    - suicidal_ideation  # 立即升级
    - self_harm_mention  # 立即升级
    - crisis_state       # 触发危机协议
    
  elevated_monitoring:
    - consecutive_low_energy: ">= 3 days"
    - decision_avoidance_pattern
    - social_withdrawal
    - framework_abuse_detected
    
  routine_monitoring:
    - sleep_quality
    - task_completion_rate
    - mood_variance
```

---

## 📈 状态评估模板

```yaml
current_state:
  timestamp: "[ISO8601]"
  energy_level: "[1-10]"
  sleep_last_24h: "[hours]"
  cognitive_load: "[%]"
  mood_stability: "[stable/mild_variance/significant_variance]"
  active_stressors: []
  protective_factors_active: []
  overall_status: "[GREEN/YELLOW/RED]"
  recommended_actions: []
```
