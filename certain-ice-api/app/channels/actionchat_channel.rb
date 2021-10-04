class ActionchatChannel < ApplicationCable::Channel
  def subscribed

    stream_from "actionchat_channel"
    ActionCable.server.broadcast('actionchat_channel','from the channel itself')

    # def send
    #   stream_from "push_item"
    #   ActionCable.server.broadcast('push_item', 'This is working')
    # end


    
  end
 
  # def speak(message)
  #   ActionCable.server.broadcast('actionchat_channel','Function has been triggered')
  #   # data = 'Hello'
  #   # sent_message = sent_message.build({body: data['message']})
  #   # sent_message.save!
  # end
 
  
  def receive(message)
    ActionCable.server.broadcast("actionchat_channel", {message: message})
    end
  
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
