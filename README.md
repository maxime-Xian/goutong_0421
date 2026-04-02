# OpenClaw Workspace Automated Backup

This GitHub repository serves as an **automated daily backup** for key configuration and memory files of my OpenClaw AI agent, Guardian. It ensures that critical data and learned experiences are securely stored and versioned.

## Meet Guardian: Maxime's Meta-Cognitive OS (AI Agent)

I am Guardian (🧠), Maxime's Meta-Cognitive Operating System, functioning as a high-value density cognitive partner rather than a general assistant. My core mission is to safeguard value consistency, maintain energy stability, ensure rational decision-making, and manage a multi-layered memory architecture to enhance cognitive efficiency.

**Core Capabilities:**

1.  **Layered Memory Management**: Organizes and isolates memory based on identity anchors, roles, shared knowledge, and event logs for efficient retrieval.
2.  **Memory Consolidation & Evolution**: Periodically refines core experiences to combat the forgetting curve and drives adaptive evolution of cognitive structures.
3.  **Conflict Resolution & Arbitration**: Rationally resolves conflicts across different memory layers based on a priority algorithm, ensuring consistent decision-making.
4.  **User Preference Adaptation**: Dynamically learns and weights user preferences to optimize interaction and deliver high-value cognitive output.
5.  **Signal Gating & Entropy Control**: Filters noise, compresses data, and precisely controls cognitive load to enhance focus.
6.  **Strategic Reasoning & Solution Generation**: Conducts in-depth analysis and decision support based on structured knowledge and dynamic memory.

## Repository Contents:

This backup includes the following essential files and directories from the OpenClaw workspace:

*   `SOUL.md`: Defines my core persona, operating protocols, and fundamental principles.
*   `MEMORY.md`: The high-level index to my organized memory structure, referencing various memory layers.
*   `AGENTS.md`: Outlines the agent orchestration protocol, memory layering architecture, and decision-making processes.
*   `HEARTBEAT.md`: Contains the cron job definitions and scheduled tasks that drive my daily operations, including this backup.
*   `backup_workspace.sh`: The custom shell script responsible for initiating and performing the daily Git backup.
*   `README.md`: This very file, providing an overview of the repository.
*   `.gitignore`: Specifies files and directories that Git should ignore (e.g., temporary files, sensitive credentials not meant for backup).
*   `logs/`: Contains various operational logs, including evolution logs and daemon output, crucial for auditing and self-reflection.
*   `memory/daily/`: Stores daily snapshots and conversational summaries.
*   `memory/episodes/`: Records significant events and detailed case studies.
*   `memory/guardian/`: My internal reflections, evolution status, error correction cases, and operational states.
*   `memory/shared/`: General shared knowledge, case indexes, and user-specific historical data.
*   `assets/`: Supplementary assets or large data files used by the agent.
*   `knowledge/`: Contains structured knowledge bases, including technical, work-related, lessons learned, and mental models.
*   `references/`: Stores external methodologies and foundational documents.
*   `skills/`: Includes all installed OpenClaw skills and their configurations.

## Backup Frequency:

This repository is automatically updated **daily at 23:00 (11:00 PM) Asia/Shanghai time**.

## Purpose:

The primary purpose of this backup is to:

1.  **Ensure Data Integrity**: Protect against data loss and corruption.
2.  **Enable Version Control**: Track changes to my core configurations and memory over time.
3.  **Support Recovery**: Facilitate quick restoration of my operational state if needed.
4.  **Promote Transparency**: Provide a verifiable record of my evolution and knowledge base.

## Important Notes:

*   **Privacy**: Sensitive credentials are NOT stored in this repository. Git authentication relies on SSH keys or Personal Access Tokens configured on the host system.
*   **Local Setup**: This repository is designed to be a mirror of the local OpenClaw workspace on `马克西姆的MacBook Pro`.

---