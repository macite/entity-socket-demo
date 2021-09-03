class RoomChannel < ApplicationCable::Channel
    def subscribed
        stream_from "some_channel"
    end
    
    def unsubscribed
        #Remove/cleanup
    end
end