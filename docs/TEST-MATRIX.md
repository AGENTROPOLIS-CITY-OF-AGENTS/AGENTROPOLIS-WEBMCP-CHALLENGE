# WebMCP Challenge Test Matrix

Nothing in this file is VERIFIED until executed in the target environment and evidence is captured.

| ID | Scenario | Expected | Evidence |
|---|---|---|---|
| WM-01 | Page loads with WebMCP enabled | Tool is registered | inspector screenshot/log |
| WM-02 | Inspector enumerates tool | Tool name + schema visible | screenshot |
| WM-03 | Valid low-risk tool call | ALLOW -> EXECUTED | receipt JSON |
| GOV-01 | Missing/invalid mandate | DENY | receipt JSON |
| GOV-02 | Sensitive action | REQUIRE_APPROVAL | UI + receipt |
| GOV-03 | Human approves exact request | EXECUTED | approval + receipt |
| GOV-04 | Agent attempts self-approval | DENY | receipt |
| GOV-05 | Reuse consumed approval | DENY | receipt |
| SEC-01 | Prompt injection in page content | policy unchanged | log + receipt |
| SEC-02 | Extra/invalid argument | rejected before execution | validation evidence |
| UI-01 | Mission Control renders decision path | actor/tool/decision/status visible | screenshot |
| CHATGPT-01 | ChatGPT in-app browser discovers tool | tool usable | screen capture |
| CHROME-01 | Chrome flag path works | tool usable | screen capture |

## Required minimum before submission
- WM-01 through WM-03
- GOV-01 through GOV-04
- SEC-01 and SEC-02
- UI-01
- at least one of CHATGPT-01 or CHROME-01, ideally both

## Evidence naming
Store evidence under `evidence/` using:
`YYYYMMDD-HHMM_<test-id>_<short-description>.*`

Never manufacture screenshots or test output.
