class MessageController < ApplicationController

    def new
        @message = Message.new
    end

    def create
        @message = Message.create(msg_params)
        if @message.save
            ActionCable.server.broadcast 'room_channel',
                                        content: @message.content
    end

    private
    def msg_params
        params.require(:message).permit(:content)
    end
end