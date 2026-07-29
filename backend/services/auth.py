import random
from datetime import datetime, timedelta

from passlib.context import CryptContext
from jose import JWTError, jwt
# Password hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# JWT configuration
SECRET_KEY = "42bc294c237dd62b4514e4a9ed3034558f03b99c565df7e86e84dd8cd0ac11ca"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
def hash_password(password: str) -> str:
    """
    Hash a plain text password before storing it in the database.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that the entered password matches the stored hash.
    """
    return pwd_context.verify(plain_password, hashed_password)
def create_access_token(data: dict):
    """
    Create a JWT access token with an expiration time.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
def verify_access_token(token: str):
    """
    Verify a JWT access token and return its payload.
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        return None