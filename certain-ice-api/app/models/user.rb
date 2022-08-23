class User < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :name,     presence: true
  validates :password, presence: true
  

  def say_hello
    puts "Hello from #{self.name}!"
  end
end
