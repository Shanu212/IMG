from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'comments'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        comment = json.loads(text_data)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
            'type': 'user_comment',
            'comment': comment,
            }
        )


    async def user_comment(self, event):
        comment = event['comment']
        
        await self.send(text_data = json.dumps({
            'comment': comment
        }))