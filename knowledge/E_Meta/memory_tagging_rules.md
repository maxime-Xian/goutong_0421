# E_Meta - Memory Tagging Rules（元知识打标规则）
## 核心目的
给每条知识自动或手动打高质量 tags，让 Proactive Pulse 和 Mode D 能精准过滤历史证据。

## 推荐 metadata 结构
{
 "type": "A_Internalized" | "E_Meta" | "pattern",
 "tags": ["self-attack", "willpower-press", ...],
 "year": 2018,
 "risk_level": "high" | "medium" | "low",
 "category": "behavior" | "event" | "lesson" | "health",
 "keywords": ["硬扛", "自我攻击"]
}

## 固定标签类别（必须至少打 3-5 个）

### 旧脚本类（Mode D 最高优先级）
- self-attack, self-criticism, imposter-feeling
- willpower-press, hard-carry, force-through
- trivial-escape, detail-trap, perfectionism
- avoid-core-decision, procrastination

### 能量/健康类
- energy-crash, sleep-low, heart-warning, bipolar-fluctuation
- adrenaline-rush, overwork

### 历史时间类
- 2018, 2019, 2026, childhood, africa-campaign

### 干预相关
- lesson-learned, high-risk, success-case, failure-case

### 行为模式类
- designer-vs-executor, punish-self, reward-later

## 使用规则
- 在 add() 时强制要求 tags 字段
- Heartbeat 任务中让 ECA 心理/战略专家自动生成 tags
- 搜索时优先用 filters.tags + filters.risk_level 过滤
