# QFileShare Server

Server for a secure file-sharing application, developed using FastAPI and integrated with post-quantum cryptographic techniques.

## Server Setup:

**Use the following commands to create a Python virtual environment and install the required dependencies for this project.**

```bash
# Setup virtual environment
python -m venv venv

# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install the packages
pip install -r requirements.txt
```

---

### Setting Up Environment Variables

**Create a `.env` file and add the following authentication variables. You can refer to `.env.example`.**

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

**Create a `.env` file if not pre in the local environment and add the following variables:**

```plaintext
DATABASE_USER=USER
DATABASE_PASSWORD=PASSWORD
DATABASE_NAME=DB
DATABASE_PORT=5432
DATABASE_HOST=localhost
```

**Replace `USER`, `PASSWORD` and `DB` with the variables used during the PostgreSQL database setup.**

**All databases used by this application will be automatically created if they do not already exist upon server startup. Ensure .env is configured properly.**

---

## Start the server:

```bash
# Unix Env
source venv/bin/activate

# Windows
venv\Scripts\activate

fastapi dev main.py
```

**Note:** Use `python3` or `pip3` if the regular commands do not execute properly.
