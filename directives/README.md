# Directives

This directory contains Standard Operating Procedures (SOPs) for the AI agent.

## Structure of a Directive
Each directive should include:
- **Goal**: What is the objective?
- **Inputs**: What data or parameters are required?
- **Execution**: Which scripts in `execution/` should be run?
- **Outputs**: What are the deliverables or expected results?
- **Edge Cases**: Known limitations or specific handling instructions.

## Principles
1. **Push complexity to code**: Logic belongs in `execution/` scripts.
2. **Deterministic execution**: Use Python scripts for repeatable tasks.
3. **Self-anneal**: Update directives with learnings from failures.
