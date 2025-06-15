from app.extensions import db

class SignedUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    signed_name = db.Column(db.String(80), unique=True)

    def serialize(self):
        return {
            'id': self.id,
            'signed_name': self.signed_name
        }