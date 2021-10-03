module ApplicationCable
  class Channel < ActionCable::Channel::Base
    def speak(message)
      ActionCable.server.broadcast('actionchat_channel','Function has been triggered')
      # data = 'Hello'
      # sent_message = sent_message.build({body: data['message']})
      # sent_message.save!
    end
  end
end
