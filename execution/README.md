# Execution Scripts

This directory contains deterministic Python scripts used by the AI agent to perform tasks.

## Principles
1. **No manual work**: Use scripts for API calls, data processing, and file operations.
2. **Environment Variables**: Use `.env` for secrets and configuration.
3. **Robustness**: Scripts should handle errors gracefully and provide clear exit codes/output.
4. **Modularity**: Small, single-purpose scripts are preferred over large, complex ones.
