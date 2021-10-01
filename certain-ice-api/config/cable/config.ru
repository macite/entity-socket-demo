# This file is used by Rack-based servers to start the application.

require_relative "../environment"

Rails.application.eager_load!
run ActionCable.server