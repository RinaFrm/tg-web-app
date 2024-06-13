from fastapi import FastAPI, HTTPException, Path

from classes import User, UpdateUsernameRequest, UpdatePointsRequest, FarmParams, AutofarmParams
from database.models import add_user, get_user, get_all_users, update_username_for_user_in_db, update_user_points_in_db, \
    update_user_farm_params_in_db, update_user_autofarm_params_in_db

app = FastAPI()


@app.get("/users")
async def list_users():
    users = get_all_users()
    return users


@app.get("/users/{username}")
async def get_user_by_username(username: str):
    user = get_user(username)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/users", status_code=201)
async def create_user(user: User):
    if get_user(user.username):
        raise HTTPException(status_code=400, detail="User already exists")
    add_user(user.username)
    return {"message": "User added successfully"}


@app.put("/users/{username}/update/username")
async def update_user_name(update_request: UpdateUsernameRequest, username: str = Path(...)):
    existing_user = get_user(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_username = update_request.new_username
    if get_user(new_username):
        raise HTTPException(status_code=400, detail="New username already exists")

    try:
        update_username_for_user_in_db(username, new_username)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "Username updated successfully"}


@app.put("/users/{username}/update/points")
async def update_user_name(update_request: UpdatePointsRequest, username: str = Path(...)):
    existing_user = get_user(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    points = update_request.points
    try:
        update_user_points_in_db(username, points)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User points updated successfully"}


@app.put("/users/{username}/update/farm_params")
async def update_user_name(farm_params: FarmParams, username: str = Path(...)):
    existing_user = get_user(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        update_user_farm_params_in_db(username, farm_params)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User farm params updated successfully"}


@app.put("/users/{username}/update/autofarm_params")
async def update_user_name(autofarm_params: AutofarmParams, username: str = Path(...)):
    existing_user = get_user(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        update_user_autofarm_params_in_db(username, autofarm_params)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User farm params updated successfully"}
