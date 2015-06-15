require "sinatra"

get "/" do
  "Hello, world"
end

get "/recipes/:id" do
  @id = params["id"]
  haml :recipe, format: :html5
end
