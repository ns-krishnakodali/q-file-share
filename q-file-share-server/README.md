# QFileShare Server
Server for secure file sharing application, developed using Post-Quantum Cryptography techniques

## Getting Started with QFileShare using FastAPI

## Setup:

```bash
# Setup virtual environment
python -m venv venv

# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install FastAPI
pip install "fastapi[standard]"

# Start the server
fastapi dev main.py
```
**Note:** Use `python3` or `pip3` if the regular commands are not executing.

## Commit Message Format

Commit messages need to follow

```
<Tag>: <Summary>
```

Following tags to be used for commit messages.

- **Breaking** - For a backward-incompatible enhancement or feature.
- **Build** - Changes applied to build process only.
- **Chore** - For refactoring, adding test cases, etc.
- **Docs** - Changes for documentation only.
- **Fix** - For a bug fix.
- **New** - For a new feature.
- **Update** - Either for backwards-compatibility or for a rule change that adds reported problems.
- **WIP** - For Work that is still in progress but needs to be committed.
