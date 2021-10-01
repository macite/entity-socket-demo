class ActionchatChannel < ApplicationCable::Channel
  def subscribed

    stream_from "actionchat_channel"
  end

  def recieve(data)
    data['user'] = current_user
    ActionCable.server.broadcast('actionchat_channel',data)
  end 

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
