class WebNotificationChannel < ApplicationCable::Channel

    def subscribe
        stream_from "web_notification_channel"
    end

    def unsubscribe
        # transmit type: 'success', data: 'Notifications turned off. Good-bye!'
    end
end