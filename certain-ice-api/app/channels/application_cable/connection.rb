module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # identified_by :current_user

    def connect
      # self.current_user = find_verified_user
      # logger.add_tags 'ActionCable', "User #{current_user.id}"
      # ActionCable.server.broadcast('actionchat_channel','hello')
      puts "connect"
    end
  end
end