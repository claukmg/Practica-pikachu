import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError(
        "Falta JWT_SECRET_KEY. Copia .env.example a .env y pon ahí tu propia clave."
    )

ALGORITMO = "HS256"
MINUTOS_EXPIRACION = 60 * 24


def hashear_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def crear_token(usuario_id: int, usuario: str) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=MINUTOS_EXPIRACION)
    payload = {"sub": str(usuario_id), "usuario": usuario, "exp": expira}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITMO)


def decodificar_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITMO])
