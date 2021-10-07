class RoomChannel < ApplicationCable::Channel
    def subscribed
        stream_from 'room_channel'
    end
    
    def unsubscribed
        #Remove/cleanup
    end
end