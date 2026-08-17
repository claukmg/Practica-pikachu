import sqlite3

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from database import inicializar_db, obtener_conexion
from schemas import (
    FavoritoRespuesta,
    TokenRespuesta,
    UsuarioLogin,
    UsuarioPublico,
    UsuarioRegistro,
)
from security import crear_token, decodificar_token, hashear_password, verificar_password

app = FastAPI(title="Pokédex Nivel 3 — API de login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8030",
        "http://127.0.0.1:8030",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

esquema_bearer = HTTPBearer()


@app.on_event("startup")
def al_iniciar():
    inicializar_db()


def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials = Depends(esquema_bearer),
) -> UsuarioPublico:
    try:
        payload = decodificar_token(credenciales.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "El token expiró, inicia sesión de nuevo")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")

    return UsuarioPublico(id=int(payload["sub"]), usuario=payload["usuario"])


@app.post("/auth/register", response_model=UsuarioPublico, status_code=status.HTTP_201_CREATED)
def registrar(datos: UsuarioRegistro):
    with obtener_conexion() as conexion:
        try:
            cursor = conexion.execute(
                "INSERT INTO usuarios (usuario, password_hash) VALUES (?, ?)",
                (datos.usuario, hashear_password(datos.password)),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(status.HTTP_409_CONFLICT, "Ese usuario ya existe")

        return UsuarioPublico(id=cursor.lastrowid, usuario=datos.usuario)


@app.post("/auth/login", response_model=TokenRespuesta)
def iniciar_sesion(datos: UsuarioLogin):
    with obtener_conexion() as conexion:
        fila = conexion.execute(
            "SELECT id, usuario, password_hash FROM usuarios WHERE usuario = ?",
            (datos.usuario,),
        ).fetchone()

    if not fila or not verificar_password(datos.password, fila["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario o contraseña incorrectos")

    token = crear_token(fila["id"], fila["usuario"])
    return TokenRespuesta(access_token=token)


@app.get("/auth/me", response_model=UsuarioPublico)
def usuario_actual(usuario: UsuarioPublico = Depends(obtener_usuario_actual)):
    return usuario


@app.get("/favoritos", response_model=FavoritoRespuesta)
def listar_favoritos(usuario: UsuarioPublico = Depends(obtener_usuario_actual)):
    with obtener_conexion() as conexion:
        filas = conexion.execute(
            "SELECT pokemon FROM favoritos WHERE usuario_id = ? ORDER BY pokemon",
            (usuario.id,),
        ).fetchall()

    return FavoritoRespuesta(favoritos=[fila["pokemon"] for fila in filas])


@app.post("/favoritos/{pokemon}", response_model=FavoritoRespuesta, status_code=status.HTTP_201_CREATED)
def agregar_favorito(pokemon: str, usuario: UsuarioPublico = Depends(obtener_usuario_actual)):
    pokemon = pokemon.lower().strip()
    with obtener_conexion() as conexion:
        conexion.execute(
            "INSERT OR IGNORE INTO favoritos (usuario_id, pokemon) VALUES (?, ?)",
            (usuario.id, pokemon),
        )
        filas = conexion.execute(
            "SELECT pokemon FROM favoritos WHERE usuario_id = ? ORDER BY pokemon",
            (usuario.id,),
        ).fetchall()

    return FavoritoRespuesta(favoritos=[fila["pokemon"] for fila in filas])


@app.delete("/favoritos/{pokemon}", response_model=FavoritoRespuesta)
def quitar_favorito(pokemon: str, usuario: UsuarioPublico = Depends(obtener_usuario_actual)):
    pokemon = pokemon.lower().strip()
    with obtener_conexion() as conexion:
        conexion.execute(
            "DELETE FROM favoritos WHERE usuario_id = ? AND pokemon = ?",
            (usuario.id, pokemon),
        )
        filas = conexion.execute(
            "SELECT pokemon FROM favoritos WHERE usuario_id = ? ORDER BY pokemon",
            (usuario.id,),
        ).fetchall()

    return FavoritoRespuesta(favoritos=[fila["pokemon"] for fila in filas])
