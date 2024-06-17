from datetime import datetime
from pydantic import BaseModel


class FarmParams(BaseModel):
    energy: int
    max_energy: int
    points_per_click: int
    recovery_time: str
    recovery_start_time: datetime
    status: str


class AutofarmParams(BaseModel):
    farm_time: str
    auto_farm_points: float
    farm_points_per_min: int
    farm_time_start: datetime
    full_bar_multiplier: float
    status: str


class User(BaseModel):
    username: str


class UpdateUsernameRequest(BaseModel):
    new_username: str


class UpdatePointsRequest(BaseModel):
    points: float
    energy: int


class UpdateStatusRequest(BaseModel):
    new_status: str


