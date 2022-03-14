# require 'certain-ice-api/app/api/message_api.rb'

class MessageApi < Grape::API

  params do 
    requires :content, type: String, desc: 'Message content'
  end
  post '/messages' do
    message_parameters = ActionController::Parameters.new(params).permit(
      :content,
      :conversation_id,
      :user_id
    )

    message = Message.create!(message_parameters)
    if message.save
      puts "broadcasting to chat_channel: #{message.content}"
      ActionCable.server.broadcast('chat_channel', message.content)
    end
    message
  end

  desc 'Allow updating of a message'
  params do
    requires :content, type: String, desc: 'Message content'
  end
  put '/messages/:id' do
    message_parameters = ActionController::Parameters.new(params)
    .permit(
      :content
    )
    Message.find(params[:id]).update! message_parameters
  end

  desc 'Delete the message with the indicated id'
  params do
    requires :id, type: Integer, desc: 'The id of the message to delete'
  end
  delete '/messages/:id' do
    Message.find(params[:id]).destroy!
    true
  end


  params do
    optional :conversation_id, type: Integer, desc: 'The id of the message conversation'
  end
  get '/messages' do
    if params["conversation_id"]
      Message.where(conversation_id: params["conversation_id"])
    else
      Message.all
    end
  end

end