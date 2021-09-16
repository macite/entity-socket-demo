class AppearanceChannel < ApplicationCable::Channel
    def subscribe
        stream_from "appearence_channel"
    end
    def unsubscribe
        current_user.away
    end
    def appear
        current_user.appear
    end
    def away
        current_user.away
    end
end