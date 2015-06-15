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
  @recipe_steps = @recipe.action_steps_with_timers

  haml :recipe, format: :html5
end
