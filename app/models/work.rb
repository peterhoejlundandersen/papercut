class Work < ApplicationRecord
  mount_uploader :cover_image, WorkCoverUploader
  enum category: [:laes, :se, :hoer]

  belongs_to :theme
  has_many :news, dependent: :destroy

  validates_presence_of :title
end
