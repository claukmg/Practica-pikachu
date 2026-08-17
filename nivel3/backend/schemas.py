from pydantic import BaseModel, Field


class UsuarioRegistro(BaseModel):
    usuario: str = Field(min_length=3, max_length=32)
    password: str = Field(min_length=6, max_length=128)


class UsuarioLogin(BaseModel):
    usuario: str
    password: str


class UsuarioPublico(BaseModel):
    id: int
    usuario: str


class TokenRespuesta(BaseModel):
    access_token: str
    token_type: str = "bearer"


class FavoritoRespuesta(BaseModel):
    favoritos: list[str]
