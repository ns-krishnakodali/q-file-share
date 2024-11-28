# QFileShare Server

Server for a secure file-sharing application, developed using FastAPI and
integrated with post-quantum cryptographic techniques.

## Server Setup:

**Use the following commands to create a Python virtual environment and install
the required dependencies for this project.**

```bash
# Setup virtual environment
python -m venv venv

# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install FastAPI, SQLAlchemy and other packages
pip install "fastapi[standard]" sqlalchemy psycopg2 python-dotenv pyjwt bcrypt pydantic
```

---

### Setting Up Environment Variables

**Create a `.env` file and include the following variables required for
authentication.**

```plaintext
SECRET_KEY=SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=300
```

**Generate a secret key using the following Python code:**

```python
import secrets
print(secrets.token_hex(32))
```

---

### Database Setup:

Run this command:

```bash
sudo -u postgres psql postgres
```

```sql
-- Replace the placeholders i.e. USER and PASSWORD enclosed in <> with the appropriate values.
CREATE ROLE myuser LOGIN PASSWORD 'mypassword';
CREATE DATABASE mydb WITH OWNER = myuser;
```

**Create a `.env` file if not pre in the local environment and add the following
variables:**

```plaintext
DATABASE_USER=myuser
DATABASE_PASSWORD=mypassword
DATABASE_NAME=mydb
DATABASE_PORT=5432
DATABASE_HOST=localhost
SECRET_KEY=a428bc0decac8899bfaecadde8eb0f6f4f1a68ebfc9bfad7c447361bd088a992
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=300
```

**Replace `USER`, `PASSWORD` and `DB` with the variables used during the
PostgreSQL database setup.**

**All databases used by this application will be automatically created if they
do not already exist upon server startup. Ensure .env is configured properly.**

---

## Start the server:

```bash
# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

fastapi dev main.py
```

**Note:** Use `python3` or `pip3` if the regular commands do not execute
properly.

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
- **Update** - Either for backwards-compatibility or for a rule change that adds
  reported problems.
- **WIP** - For Work that is still in progress but needs to be committed.
