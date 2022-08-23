class Message < ApplicationRecord
  # after_save do |message|
  #   ActionCable.server.broadcast 'room_channel', content: message.to_json
  # end

  def to_dto
    {
      id: self.id,
      content: self.content,
      message_kind: self.message_kind,
      message_color: self.message_color
    }
  end
end
