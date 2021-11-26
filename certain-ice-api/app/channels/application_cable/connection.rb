module ApplicationCable
  class Connection < ActionCable::Connection::Base
  # identified_by : current_user
  
  def connect
    puts 'connect'
    # self.current_user = find_verified_user
    ActionCable.server.broadcast("chat_channel", {type:'alert', data:"connected"})
  end

  def disconnect
    puts 'disconnect'
    ActionCable.server.broadcast("chat_channel", {type:'alert', data:"disconnected"})
  end

  # private
  #   def find_verified_user
  #     verified_user == env['warden'].user
  #     verified_user
  #     else
  #       reject_unauthorized_connection
  #     end
  #   end
  end
end
