# 2-3 Minute Demo Script

## 0:00-0:20 — Problem
Agents can discover WebMCP tools, but discovery alone should not grant authority. AGENTROPOLIS adds a governed execution corridor between tool discovery and consequential action.

## 0:20-0:45 — Discovery
Open the live app in ChatGPT's in-app browser or Chrome with WebMCP enabled. Show the registered site tool being discovered. Keep this visual and fast.

## 0:45-1:10 — Allowed action
Ask the agent to perform the bounded low-risk action. Show:
`WebMCP -> policy -> ALLOW -> execution -> receipt`.
Open Mission Control and point to actor, tool, decision, and status.

## 1:10-1:50 — Approval action
Ask the agent for the sensitive/state-changing variant. Governance returns `REQUIRE_APPROVAL`. Show that nothing executes yet. Human approves the exact request. Then execute and show the new receipt.

## 1:50-2:15 — Denied action
Attempt a prohibited or out-of-mandate request. Show `DENY` and prove that the executor never runs.

## 2:15-2:40 — Why this matters
WebMCP makes websites agent-readable and agent-operable. AGENTROPOLIS demonstrates a control plane for accountable operation: authority is explicit, policy is deterministic, humans remain in the loop where needed, and every action leaves a receipt.

## 2:40-3:00 — Close
Display the architecture corridor and repository URL. End on:

**Discovery is not authority. Connectivity is not permission. Execution requires governance.**
