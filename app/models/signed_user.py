from app.extensions import db

class SignedUser(db.Model):
    __tablename__ = 'signed_users'
    id = db.Column(db.Integer, primary_key=True)
    signed_name = db.Column(db.String(80), unique=True)

    def __init__(self, signed_name) -> None:
        self.signed_name = signed_name

    def serialize(self):
        return {
            'id': self.id,
            'signed_name': self.signed_name
        }
