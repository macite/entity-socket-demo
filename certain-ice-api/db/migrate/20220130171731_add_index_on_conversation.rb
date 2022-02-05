class AddIndexOnConversation < ActiveRecord::Migration[6.1]
  def change
    add_index :conversations, [:sender_id, :recipient_id], unique: true
  end
end
