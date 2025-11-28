from beanie import Document
from pydantic import BaseModel

class Notes(Document):
    id: int
    user_id: int
    content: str
    product_seller_id: int
    quantity: int

    class Settings:
        name = "notes" # MongoDB Collection Name 