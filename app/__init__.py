from flask import Flask
from .routes import main
from .extensions import db, migrate
from .models.signed_user import SignedUser

def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aoifesplace.db'

    db.init_app(app=app)
    migrate.init_app(app=app, db=db)

    app.register_blueprint(main)

    return app