from app.extensions import db
from flask_bcrypt import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False)
    password = db.Column(db.String(32), nullable=False)

    def __init__(self, username) -> None:
        self.username = username

    def set_password(self, password) -> None:
        salt = bcrypt.gensalt()
        self.password = bcrypt.hashpw(password.encode('utf-8'), salt=salt).decode('utf-8')

    def check_password(self, password) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))
