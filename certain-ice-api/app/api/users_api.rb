require 'grape'

class UsersApi < Grape::API

  desc 'Allow creation of a user'
  params do
    requires :username, type: String, desc: 'The username used for login'
    requires :name, type: String, desc: 'The user\'s name'
    requires :password, type: String, desc: 'The in-no-way secure password'
  end
  post '/users' do
    user_parameters = ActionController::Parameters.new(params)
      .permit(
        :username,
        :name,
        :password
      )

    User.create!(user_parameters)
  end

  desc 'Allow updating of a user'
  params do
    optional :username, type: String, desc: 'The username used for login'
    optional :name, type: String, desc: 'The user\'s name'
    optional :password, type: String, desc: 'The in-no-way secure password'
  end
  put '/users/:id' do
    user_parameters = ActionController::Parameters.new(params)
      .permit(
        :username,
        :name,
        :password
      )

    User.find(params[:id]).update! user_parameters
  end

  desc 'Delete the user with the indicated id'
  params do
    optional :id, type: Integer, desc: 'The id of the user to delete'
  end
  delete '/users/:id' do
    User.find(params[:id]).destroy!
    true
  end

  params do
    optional :filter, type: String, desc: 'Limit response to those users starting with this filter'
  end
  get '/users' do
    filter = params[:filter]
    if filter.nil?
      User.all
    else
      User.where('name LIKE ?', "#{filter}%")
    end
  end
end