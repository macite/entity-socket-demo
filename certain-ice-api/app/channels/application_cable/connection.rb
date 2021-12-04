module ApplicationCable
  class Connection < ActionCable::Connection::Base
    rescue_from StandardError, with: :report_error
    # identified_by : current_user
    
    def connect
      puts 'connecting - chat_channel'
      # self.current_user = find_verified_user
      ActionCable.server.broadcast("chat_channel", {type:'welcome', data:"user"})
    end

    def disconnect
      puts 'disconnect - chat_channel'
      ActionCable.server.broadcast("chat_channel", {type:'farewell', data:"user"})
    end

    private
    def report_error(e)
      puts e.inspect
    end

    def find_verified_user
      # verified_user == env['warden'].user
      # verified_user
      # else
      #   reject_unauthorized_connection
      # end
    end
  end
end