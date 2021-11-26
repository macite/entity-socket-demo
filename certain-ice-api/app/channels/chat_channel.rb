class ChatChannel < ApplicationCable::Channel
    def subscribed
        puts 'HERE -- subscribing'
        stream_from 'chat_channel'
    end 

    def recieve(data)
        # data['user'] = current_user
        ActionCable.server.broadcast('chat_channel', {message: "test"})
    end 
end