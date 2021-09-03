class ApplicationController < ActionController::Base
    def index
        @message = Message.new
    end
end
