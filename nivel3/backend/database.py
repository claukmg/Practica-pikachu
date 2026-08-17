import sqlite3
from pathlib import Path

RUTA_DB = Path(__file__).parent / "pokedex.db"


def obtener_conexion():
    conexion = sqlite3.connect(RUTA_DB)
    conexion.row_factory = sqlite3.Row
    conexion.execute("PRAGMA foreign_keys = ON")
    return conexion


def inicializar_db():
    with obtener_conexion() as conexion:
        conexion.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)
        conexion.execute("""
            CREATE TABLE IF NOT EXISTS favoritos (
                usuario_id INTEGER NOT NULL,
                pokemon TEXT NOT NULL,
                PRIMARY KEY (usuario_id, pokemon),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
