require 'grape'

class MessageApi < Grape::API

  params do 
    requires :content, type: String, desc: 'Message content'
    requires :message_color, type: Integer, desc: 'Message color'
    requires :message_kind, type: String, desc: 'Message kind'
  end
  post '/messages' do

    message_parameters = ActionController::Parameters.new(params).permit(
      :content,
      :message_color,
      :message_kind
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
    optional :content, type: String, desc: 'Message content'
    optional :message_kind, type: String, desc: 'Message kind'
    optional :message_color, type: Integer, desc: 'Message color'
  end
  put '/messages/:id' do
    message_parameters = ActionController::Parameters.new(params)
    .permit(
      :content,
      :message_kind,
      :message_color
    )
    message = Message.find(params[:id])
    message_parameters[:message_color] = message_parameters[:message_color] + 1;
    message.update! message_parameters
    message
  end
  
  desc 'Delete the message with the indicated id'
  params do
    requires :id, type: Integer, desc: 'The id of the message to delete'
  end
  delete '/messages/:id' do
    Message.find(params[:id]).destroy!
    true
  end

  get '/messages' do
    Message.all
  end

end