from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware

from classes import User, UpdateUsernameRequest, UpdatePointsRequest, UpdateStatusRequest
from database.models import *

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:3000",
    # Добавьте другие допустимые источники, если необходимо
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def user_exist_check(username):
    existing_user = get_user(username)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")


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
    user_exist_check(username)

    new_username = update_request.new_username
    if get_user(new_username):
        raise HTTPException(status_code=400, detail="New username already exists")

    try:
        update_username_for_user_in_db(username, new_username)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "Username updated successfully"}


@app.put("/users/{username}/update/points")
async def update_user_points(update_request: UpdatePointsRequest, username: str = Path(...)):
    user_exist_check(username)

    points = update_request.points
    try:
        update_user_points_in_db(username, points)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User points updated successfully"}


@app.put("/users/{username}/update/farm_params")
async def update_user_farm_params(farm_params: FarmParams, username: str = Path(...)):
    user_exist_check(username)

    try:
        update_user_farm_params_in_db(username, farm_params)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User farm params updated successfully"}


@app.put("/users/{username}/update/autofarm_params")
async def update_user_autofarm_params(autofarm_params: AutofarmParams, username: str = Path(...)):
    user_exist_check(username)

    try:
        update_user_autofarm_params_in_db(username, autofarm_params)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User autofarm params updated successfully"}


@app.put("/users/{username}/update/energy/status")
async def update_user_energy_status(update_request: UpdateStatusRequest, username: str = Path(...)):
    user_exist_check(username)

    try:
        update_user_energy_status_in_db(username, update_request.new_status)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User autofarm params updated successfully"}


@app.put("/users/{username}/update/autofarm/status")
async def update_user_autofarm_status(update_request: UpdateStatusRequest, username: str = Path(...)):
    user_exist_check(username)

    try:
        update_user_autofarm_status_in_db(username, update_request.new_status)
    except ValueError as e:
        return {"message": str(e)}
    return {"message": "User autofarm params updated successfully"}

