from flask import Blueprint, make_response, render_template, request, jsonify, redirect, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, unset_access_cookies, verify_jwt_in_request
from app.extensions import db
from app.models.signed_user import SignedUser
from app.models.blog_post import BlogPost
from app.models.user import User

main = Blueprint('main', __name__)

def check_list_none_or_empty(db_list):
    if db_list is None or db_list == []:
        return None
    return db_list

@main.route('/', methods=['GET'])
def root():
    signed_users = check_list_none_or_empty([user.serialize() for user in db.session.query(SignedUser).all()])
    

    return make_response(render_template('index.html',
                                         signed_users=signed_users),
                                         200)

@main.route('/sign_name', methods=['POST'])
def sign_name():
    request_data = request.json
    if request_data:
        signed_name = request_data['signed_name']

        db.session.add(SignedUser(signed_name=signed_name))
        db.session.commit()

        return jsonify({'msg': 'User signed name successfully'}), 200

    return jsonify({'msg': 'Data not found in POST request'}), 400

@main.route('/login', methods=['GET', 'POST'])
def login():
    # check if we're already logged in 
    try:
        verify_jwt_in_request(optional=True)
        current_user = get_jwt_identity()
        if current_user:
            return redirect(url_for('main.admin_page'))
    except Exception:
        pass

    if request.method == 'POST':
        request_data = request.json
        if request_data:
            username = request_data['username']
            password = request_data['password']
        
            user = db.session.query(User).filter_by(username=username).first()
            try:
                if user.check_password(password=password):
                    response = jsonify({'msg': 'login successful'})
                    access_token = create_access_token(identity=username)
                    set_access_cookies(response, access_token)
                    return response, 200
                else:
                    print('password')
                    return jsonify({'msg': 'login unsuccessful'}), 401
            except Exception as e:
                print('try')
                print(e)
                return jsonify({'msg': 'login unsuccessful'}), 401

        return jsonify({'msg': 'Error parsing login info from POST request'}), 401
    return make_response(render_template('login.html'), 200)

@main.route('/logout', methods=['GET'])
def logout():
    response = jsonify({'msg': 'logout successful'})
    unset_access_cookies(response)
    return response

@main.route('/admin', methods=['GET'])
@jwt_required()
def admin_page():
    # This page should allow admin users to delete and modify signed names and posts
    current_user = get_jwt_identity()
    blog_posts = check_list_none_or_empty(db.session.query(BlogPost).all())
    signed_users = check_list_none_or_empty(db.session.query(SignedUser).all())


    return make_response(render_template('admin.html', 
                                  current_user=current_user,
                                  blog_posts=blog_posts,
                                  signed_users=signed_users), 
                                  200)