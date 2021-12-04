class ChatChannel < ApplicationCable::Channel
    def subscribed
        puts "subscribing to chat_channel"
        stream_from "chat_channel"
    end 

    def receive(data)
        puts "receive in chat_channel"
        # data['user'] = current_user
        ActionCable.server.broadcast('chat_channel',data)
    end 
end