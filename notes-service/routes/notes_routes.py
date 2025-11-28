from fastapi import APIRouter, Depends
from models.notes_model import Notes
from fastapi import Depends
from controllers.notes_controller import notes_controller
from controllers.auth_controller import authenticate_token
from pydantic import BaseModel


notes_controller = Notes

# Schema to create/edit (user input)
class NotesCreate(BaseModel):
    user_id: int
    content: str
    #product_seller_id: int
    quantity: int

# Creates /deliveries endpoint (tag is for Swagger)
router = APIRouter( prefix = "/notes", tags = ["Notes"])

# GET /notes/:id
@router.get("/{user_id}")
async def get_note_by_user(user_id: str):
    return await NotesController.get_one(user_id)


# POST /notes
@router.post("/")
async def create_note(body: NotesCreate, user = Depends(authenticate_token)):
    return await NotesController.create_one(body, user)


# PUT /notes/:id
@router.put("/{id}")
async def edit_note(body: Notes):
    return await NotesController.edit_one(body)


# DELETE /notes/:id
@router.delete("/{id}")
async def delete_note(id: int):
    return await NotesController.delete_one(id)