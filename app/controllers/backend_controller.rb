class BackendController < ApplicationController

  def index
    @themes = Theme.all
  end

  def show_theme_content
    @theme = Theme.find(params[:theme_id])
    @works = @theme.works
  end

end