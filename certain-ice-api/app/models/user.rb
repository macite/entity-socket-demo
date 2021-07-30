class User < ApplicationRecord
  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :name,     presence: true
  validates :password, presence: true
  
end
