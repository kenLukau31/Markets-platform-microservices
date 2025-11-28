from loguru import logger
from fastapi import HTTPException
from models.notes_model import Notes
from controllers.auth_controller import authenticate_token
from pydantic import BaseModel

class NotesController:

    # Get notes by user ID 
    async def get_one(self, user_id: int):
        logger.info(f"Request: GET /notes/{id} received!")

        note = await Notes.find_one(Notes.user_id == user_id)
        
        if not note:
            logger.warning(f'Note with user ID {id} was not found')
            raise HTTPException(status_code = 404, detail = {"error": f"Note for user with ID {user_id} not found!"})

        logger.info(f"Note for user with ID {user_id} returned successfully.")
        return {f"Note for user {user_id}": note}


    # Create a new delivery
    async def create_one(self, body, user):
        logger.info(f"Request POST /notes received!")


        if user["user_id"] != body.user_id:
            raise HTTPException(
                status_code = 403,
                detail = {"error": f"Cannot create a note for another user!"}
            )

        # Verify is the user already has a note
        existing_note = await Notes.find_one(Notes.user_id == body.user_id)

        if existing_note:
            logger.warning(f"User with ID {body.user_id} already has a note!")
            raise HTTPException(
                status_code = 400,
                detail = {"error": f"User with ID {body.user_id} already has a note!"}
            )
        
        # Create note
        new_note = Notes(
            user_id = body.user_id,
            content = body.content,
            #product_seller_id = body.product_seller_id,
            quantity = body.quantity 
        )

        await new_note.insert()

        logger.info("New note successfully created!")
        return{
            "message": "New note created successfully!",
            "note": new_note
        }
        

    def delete_one(self, id: int):
        logger.info(f"Request: DELETE /deliveries/{id}")
        
        for index, delivery in enumerate(self.deliveries):
            if delivery["id"] == id:
                self.deliveries.pop(index)

                logger.info(f'Delivery with ID {id} removed successfully!')
                return {"message": "Delivery removed successfully!"}

        logger.warning(f'Delivery with ID {id} not found!')
        raise HTTPException(status_code = 404, detail = {"Error": f"Delivery with ID {id} not found!"})

notes_controller = NotesController()