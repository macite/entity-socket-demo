require 'grape'

class RoomsApi < Grape::API

  desc 'Allow creation of a Room'
  params do
    requires :sender_id, type: Integer, desc: 'Sender ID for Room'
    requires :recipient_id, type: Integer, desc: 'Recipient ID for Room'
  end
  post '/rooms' do
    room_parameters = ActionController::Parameters.new(params)
      .permit(
        :sender_id,
        :recipient_id
      )

    Conversation.create!(room_parameters)
  end

  desc 'Delete the room with the indicated id'
  params do
    optional :id, type: Integer, desc: 'The id of the room to delete'
  end
  delete '/rooms/:id' do
    Conversation.find(params[:id]).destroy!
  end

  params do
    optional :user_id, type: Integer, desc: 'Limit response to those rooms with this filter'
  end
  get '/rooms' do
    if params[:user_id].nil?
      Conversation.includes(:messages)
    else
      Conversation.where("sender_id = ?, recipient_id = ?", params[:user_id], params[:user_id]).includes(:messages)
    end
  end

  desc 'Get messages for particular room'
  params do
    requires :room_id, type: Integer, desc: 'Room ID for messages'
  end
  get '/rooms/:room_id/messages' do
    conversation = Conversation.find params[:room_id]
    conversation.messages
  end


  desc 'Create messages for particular room'
  params do
    requires :room_id, type: Integer, desc: 'Room ID for messages'
    requires :content, type: String, desc: 'Message content'
    requires :user_id, type: Integer, desc: 'Message sender_id'
  end
  post '/rooms/:room_id/messages' do
    conversation = Conversation.find params[:room_id]
    
    message_parameters = ActionController::Parameters.new(params)
      .permit(
        :user_id,
        :content
      )

    conversation.messages.create!(message_parameters)

  end
end