require "sinatra"
require "tilt/haml"
require "./din_client"

get "/" do
  "<a href=\"recipes/109751\">Rabbit</a>"
end

get "/recipes/:id" do
  @recipe = Recipe.new(params["id"])

  haml :recipe, format: :html5
end
