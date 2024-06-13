from datetime import datetime

from classes import FarmParams, AutofarmParams
from database.db import db

users_collection = db['users']
quests_collection = db['quests']


def add_user(username):
    user = {
        'username': username,
        'points': 0,
        'farm_params': {
            'energy': 1000,
            'points_per_click': 1,
            'recovery_time': '1h',
            'recovery_start_time': 0,
            'status': 'Full',
        },
        'autofarm_params': {
            'farm_time': '8h',
            'farm_points_per_min': 2,
            'farm_time_start': 0,
            'full_bar_multiplier': 1.25,
            'status': 'Not farming',
        },
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'referrals': [],

    }
    result = users_collection.insert_one(user)
    print(f"User inserted with ID: {result.inserted_id}")


def get_user(username):
    user = users_collection.find_one({'username': username})
    if user:
        user['_id'] = str(user['_id'])
    return user


def get_all_users():
    projection = {'_id': False}  # Указываем, что поле _id не должно включаться в результаты запроса
    users = users_collection.find({}, projection)
    return list(users)


def update_field_in_db(username: str, field: str, value):
    result = users_collection.update_one({'username': username}, {'$set': {field: value, 'updated_at': datetime.utcnow()}})
    if result.modified_count == 0:
        raise ValueError(f"No one field has been changed")


def update_username_for_user_in_db(username: str, new_username: str):
    update_field_in_db(username, 'username', new_username)


def update_user_points_in_db(username: str, points: int):
    update_field_in_db(username, 'points', points)


def update_user_farm_params_in_db(username: str, farm_params: FarmParams):
    update_field_in_db(username, 'farm_params', farm_params.dict())


def update_user_autofarm_params_in_db(username: str, autofarm_params: AutofarmParams):
    update_field_in_db(username, 'autofarm_params', autofarm_params.dict())
