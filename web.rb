require "sinatra"
require "tilt/haml"
require "./din_client"

get "/" do
  recipes = [109771, 109761, 109751]
  text = "<h1>Pick a recipe!</h1>" +
         "<p>These are the ones we know.</p>"
  text += recipes.map do |r|
    "<a href=\"recipes/#{r}\">Recipe #{r}</a>"
  end.join("<br />")
end

get "/recipes/:id" do
  @recipe = Recipe.new(params["id"])
  @recipe_steps = @recipe.action_steps_with_timers

  haml :recipe, format: :html5
end
