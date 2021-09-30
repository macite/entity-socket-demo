class ChatChannel < ApplicationCable::Channel
    def subscribe   
    end 

    def recieve(data)
        data['user'] = current_user
        ActionCable.server.broadcast('message',data)
    end 
end