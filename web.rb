require "sinatra"
require "tilt/haml"
require "./din_client"

get "/" do
  recipes = [109771, 109761, 109751]
  recipes.map do |r|
    "<a href=\"recipes/#{r}\">Recipe #{r}</a>"
  end.join("<br />")
end

get "/recipes/:id" do
  @recipe = Recipe.new(params["id"])
  recipe_steps = @recipe.action_steps

  # either N minutes, N-M minutes, or N to M minutes
  # or maybe N mins or M minute
  minute_matcher = /(\d+|\d+\D{1,4}\d+)\s+min(ute)?s*/

  @recipe_steps = recipe_steps.map do |step|
    step[1].gsub!(
      minute_matcher,
      '<strong class="timer" data-minutes="\1">\0</strong>'
    )
    step
  end

  haml :recipe, format: :html5
end
