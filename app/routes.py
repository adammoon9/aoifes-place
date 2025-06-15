from flask import Blueprint, make_response, render_template, request, jsonify, redirect, url_for
from app.extensions import db
from app.models.signed_user import SignedUser

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def root():
    signed_users = [user.serialize() for user in db.session.query(SignedUser).all()]
    if signed_users is None or signed_users == []:
        signed_users = None

    return make_response(render_template('index.html',
                                         signed_users=signed_users),
                                         200)

@main.route('/sign_name', methods=['POST'])
def sign_name():
    signed_name = request.json['signed_name']

    db.session.add(SignedUser(signed_name=signed_name))
    db.session.commit()

    return jsonify({'msg': 'User signed name successfully'}), 200

@main.route('/admin', methods=['GET'])
def admin_page():
    pass