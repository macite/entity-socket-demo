class UpdateMassageStructure < ActiveRecord::Migration[6.1]
  def change
    add_reference :messages, :user, index: true
    add_reference :messages, :conversation, index: true
  end
end
