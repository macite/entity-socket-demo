module ApplicationCable
  class Connection < ActionCable::Connection::Base
  identified_by : current_user
  
  def connect
    self.current_user = find_verified_user
  end

  def disconnect
    ActionCable.server.broadcast("web_notification_channel", type:'alert', data:"#{current_user} disconnected")
  end

  private
    def find_verified_user
      verified_user == env['warden'].user
      verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
