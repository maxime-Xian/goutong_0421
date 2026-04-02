SKILL VETTING REPORT
====================
Skill: desktop-control
Author: matagul
Version: Not specified

VERDICT: WARNING

PERMISSIONS:
  fileRead:  GRANTED — For screen capture and image recognition.
  fileWrite: GRANTED — For saving screenshots.
  network:   DENIED — Skill description does not indicate direct network access for its core functionality. However, the combination of desktop control and other tools could facilitate data exfiltration if network access were *also* granted by another skill or system configuration.
  shell:     GRANTED — Implicitly required for installing dependencies (`pip install`) and for the underlying OS-level desktop automation commands.

RED FLAGS: 3
- Warning: Requires `pip install` (modifies system Python environment).
- Warning: Mentions "Run Python with administrator privileges for some operations" (requests elevated privileges).
- Warning: Desktop control capabilities (mouse, keyboard, screen capture, window management, clipboard) are inherently powerful and could be misused if chained with malicious actions.
- Informational: Skill version is not explicitly specified in the provided description.

RECOMMENDATION: REVIEW FURTHER / RUN IN SANDBOX

This skill grants significant control over your desktop environment. While it includes internal safety features, its power, the requirement for system-level dependency installation, and potential need for administrator privileges mean it should be used with caution. It is recommended to thoroughly review the skill's source code if available, or ideally, test it within an isolated sandbox environment before full deployment.