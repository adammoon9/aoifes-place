from app.extensions import db
from datetime import datetime
from uuid import uuid4

class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), nullable=False)
    title = db.Column(db.String(70), nullable=False)
    content = db.Column(db.String, nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, title, content) -> None:
        self.title = title
        self.content = content
        self.uuid = str(uuid4())

    def serialize(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'upload_date': self.upload_date.strftime('%d-%m-%Y %H:%M'),
            'uuid': self.uuid
        }
