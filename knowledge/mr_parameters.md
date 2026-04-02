# MR 参数配置

[此文件将包含与MR（Meta-Reasoning）相关的参数和评估标准。]

## Gene Store（坑位记录）
| Gene | 内容 | 日期 |
|---|---|---|
| gene_knowledge_scatter | 多个heartbeat脚本散落路径，混乱17天 | 2026-03-28 |
| gene_blackbox_rejection | 用户不满被当黑箱处理 | 2026-03-28 |
| gene_lark_cli_subcommand_error_loop | lark-cli 命令执行时重复性缺少子命令，或未充分理解技能文档中的关键信息导致错误循环，特别是飞书链接解析机制 | 2026-03-29 |
| gene_cron_param_strict_validation | cron 工具复杂参数（payload.kind, delivery, sessionTarget）组合理解不足导致配置错误 | 2026-03-29 |
| gene_skill_document_deep_read_on_failure | 在工具调用失败或遇到复杂概念时，未能强制优先深入阅读相关技能文档 | 2026-03-29 |
| gene_proactive_error_break | 在检测到重复性错误模式时，未能主动中断当前操作，强制进行反思和技能探索 | 2026-03-29 |
| gene_exec_json_string_robustness | exec 命令中复杂 JSON 字符串的构建和转义鲁棒性不足，导致反复的格式错误 | 2026-03-29 |
