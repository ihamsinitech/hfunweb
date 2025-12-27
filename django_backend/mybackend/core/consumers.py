import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async

from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Reject anonymous users
        if not self.user.is_authenticated:
            await self.close()
            return

        # Each user has their own room
        self.user_room = f"user_{self.user.username}"

        await self.channel_layer.group_add(
            self.user_room,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_room,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        receiver_username = data.get("receiver")
        text = data.get("text")

        if not receiver_username or not text:
            return

        receiver = await sync_to_async(User.objects.get)(
            username=receiver_username
        )

        # Save message in DB
        message = await sync_to_async(Message.objects.create)(
            sender=self.user,
            receiver=receiver,
            text=text
        )

        payload = {
            "id": message.id,
            "sender": self.user.username,
            "receiver": receiver.username,
            "text": message.text,
            "timestamp": message.timestamp.isoformat(),
        }

        # Send to sender
        await self.channel_layer.group_send(
            f"user_{self.user.username}",
            {
                "type": "chat_message",
                "message": payload
            }
        )

        # Send to receiver
        await self.channel_layer.group_send(
            f"user_{receiver.username}",
            {
                "type": "chat_message",
                "message": payload
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))
