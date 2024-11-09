# QFileShare Server
Server for secure file sharing application, developed using Post-Quantum Cryptography techniques

## Getting Started with QFileShare using FastAPI

## Server Setup:

```bash
# Setup virtual environment
python -m venv venv

# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install FastAPI, SQLAlchemy and other packages
pip install "fastapi[standard]" sqlalchemy psycopg2 python-dotenv
```

## Database Setup:
```sql
-- Replace the placeholders i.e. USER and PASSWORD enclosed in <> with the appropriate values.
CREATE USER <USER> WITH PASSWORD '<PASSWORD>';
ALTER ROLE <USER> SET client_encoding TO 'utf8';
ALTER ROLE <USER> SET default_transaction_isolation TO 'read committed';
ALTER ROLE <USER> SET timezone TO 'UTC';
CREATE DATABASE <DB>;
GRANT ALL PRIVILEGES ON DATABASE <DB> TO <USER>;
\c EXAMPLE_DB postgres
GRANT ALL ON SCHEMA public TO <USER>;
```

- Create a `.env` file in the local environment and add the following variables:
    - DATABASE_USER=USER<br>
    - DATABASE_PASSWORD=PASSWORD<br>
    - DATABASE_NAME=DB<br>
    - DATABASE_PORT=5432<br>
    - DATABASE_HOST=localhost
- Replace `USER`, `PASSWORD` and `DB` with the variables used during the PostgreSQL database setup.

## Start the server:
```bash
# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

fastapi dev main.py
```

**Note:** Use `python3` or `pip3` if the regular commands do not execute properly.

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
