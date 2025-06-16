from flask import Flask
from .routes import main
from .extensions import db, migrate, jwt
from .models.signed_user import SignedUser
from .models.user import User
from .models.blog_post import BlogPost

def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    app.config.from_pyfile('config.py')
    
    db.init_app(app=app)
    migrate.init_app(app=app, db=db)
    jwt.init_app(app=app)

    app.register_blueprint(main)

    return app