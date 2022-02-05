class Message < ApplicationRecord
  belongs_to :user
  belongs_to :conversation, inverse_of: :messages

  validates_presence_of :content, :conversation_id, :user_id
  
  def message_time
    created_at.strftime("%m/%d/%y at %l:%M %p")
  end


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
