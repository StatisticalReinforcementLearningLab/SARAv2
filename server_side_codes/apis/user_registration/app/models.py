#!/usr/local/bin/python3
from app import db
#from __init__ import db
from passlib.hash import pbkdf2_sha256 as sha256


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)
    userinfo = db.Column(db.Text, unique = False, nullable = True)
    userdata = db.Column(db.Text, unique = False, nullable = True)
    userinfo_for_admin = db.Column(db.Text, unique = False, nullable = True)

    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}
    
    @classmethod
    def set_user_info(cls, username, userinfo):
        try:
            db.session.query(cls).filter_by(username = username).update({cls.userinfo: userinfo}, synchronize_session=False)                   
            db.session.commit()
            return {'message': 'sample'}
        except:
            return {'message': 'Something went wrong'}

    @classmethod
    def set_user_info_for_admin(cls, username, userinfo_for_admin):
        try:
            db.session.query(cls).filter_by(username = username).update({cls.userinfo_for_admin: userinfo_for_admin}, synchronize_session=False)                   
            db.session.commit()
            return {'message': 'sample'}
        except:
            return {'message': 'Something went wrong'}

    @classmethod
    def set_user_data(cls, username, userdata):
        try:
            db.session.query(cls).filter_by(username = username).update({cls.userdata: userdata}, synchronize_session=False)                   
            db.session.commit()
            return {'message': 'sample'}
        except:
            return {'message': 'Something went wrong'}

    @classmethod
    def set_user_data(cls, username, data):
        try:
            db.session.query(cls).filter_by(username = username).update({cls.data: data}, synchronize_session=False)                   
            db.session.commit()
            return {'message': 'sample'}
        except:
            return {'message': 'Something went wrong'}



    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))
    
    def add(self):
        db.session.add(self)
        db.session.commit()
    
    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)
