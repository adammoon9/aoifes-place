import os

SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///aoifesplace.db')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'test-secret-key')
JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', False)
JWT_TOKEN_LOCATION = os.getenv('JWT_TOKEN_LOCATION', ['cookies'])