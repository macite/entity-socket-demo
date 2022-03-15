class Message < ApplicationRecord
  # after_save do |message|
  #   ActionCable.server.broadcast 'room_channel', content: message.to_json
  # end

  def to_dto
    {
      id: self.id,
      content: self.content
    }
  end
end
