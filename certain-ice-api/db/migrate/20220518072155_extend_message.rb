class ExtendMessage < ActiveRecord::Migration[6.1]
  def change
    add_column :messages, :message_kind, :string
    add_column :messages, :message_color, :integer
  end
end
