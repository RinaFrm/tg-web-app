from datetime import datetime, timedelta

from database.db import db

users_collection = db['users']


def user_data_updating(user):
    if user['farm_params']['energy'] != user['farm_params']['max_energy'] and user['farm_params']['status'] == 'Recovery':
        if user['farm_params']['recovery_start_time'] and datetime.utcnow() - timedelta(hours=1) >= user['farm_params']['recovery_start_time']:
            users_collection.update_one({'username': user['username']}, {'$set': {
                'farm_params.energy': user['farm_params']['max_energy'],
                'farm_params.status': 'Full',
            }})

            user['farm_params']['energy'] = user['farm_params']['max_energy']
            user['farm_params']['status'] = 'Full'

    elif user['autofarm_params']['status'] == 'Farming':
        farm_hours = int(user['autofarm_params']['farm_time'][0])
        if datetime.utcnow() - timedelta(hours=farm_hours) >= user['autofarm_params']['farm_time_start']:
            users_collection.update_one({'username': user['username']}, {'$set': {
                'autofarm_params.auto_farm_points': farm_hours * 60 * user[
                    'autofarm_params']['farm_points_per_min'] * user['autofarm_params']['full_bar_multiplier'],
                'autofarm_params.status': 'Full',
            }})

            user['autofarm_params']['auto_farm_points'] = farm_hours * 60 * user[
                    'autofarm_params']['farm_points_per_min'] * user['autofarm_params']['full_bar_multiplier']
            user['autofarm_params']['auto_farm_points'] = 'Full'

        else:
            farming_time_difference = datetime.utcnow() - user['autofarm_params']['farm_time_start']
            total_seconds = farming_time_difference.total_seconds()
            total_minutes = total_seconds // 60

            users_collection.update_one({'username': user['username']}, {'$set': {
                'autofarm_params.auto_farm_points': total_minutes * user['autofarm_params']['farm_points_per_min'],
            }})

            user['autofarm_params']['auto_farm_points'] = total_minutes * user['autofarm_params']['farm_points_per_min']

    return user

