require "faraday"
require "faraday_middleware"

class Recipe
  def initialize(id)
    @id = id
    @client = DinClient.new
    # response.body.data.recipe
    @recipe = @client.recipe(@id)
  end

  def name
    @recipe.name
  end

  def img
    @recipe.img
  end

  def ingredients
    @recipe.ingredients
  end

  def description
    @recipe.meta.find{ |meta_obj| meta_obj.meta == "desc" }.value
  end

  def diets
    @recipe.meta.select{ |meta_obj| meta_obj.meta == "diet" }.map(&:value)
  end

  def steps(ordered: true)
    steps = @recipe.meta.select{ |meta_obj| meta_obj.meta == "prep_step" }
    if ordered
      steps.sort_by { |meta_obj| meta_obj.sequence.to_i }.map{ |meta_obj| meta_obj.value.strip }
    else
      steps.map{ |meta_obj| meta_obj.value.strip }
    end
  end

  # noticing "action items" or "headers" for each step at beginning
  # return as pairs of action header and rest of step
  def action_steps(ordered: true)
    steps(ordered: ordered).map do |step|
      matches = step.match(/^((.*?)[.?!])\s+(.+)/)
      [matches[1], matches[3]]
    end
  end
end

class DinClient
  attr_reader :conn

  def initialize
    @conn = Faraday.new(url: api_base) do |conn|
      # log requests to STDOUT
      conn.response :logger
      # parse with hashie (must come before json parsing middleware)
      conn.use FaradayMiddleware::Mashify
      # parse responses as json
      conn.response :json, content_type: /\bjson$/
      # make requests with Net::HTTP
      conn.adapter  Faraday.default_adapter
    end
  end

  def recipe(id)
    response = @conn.get "v1/recipe/view", { recipe_id: id }

    # swear i've seen this return a 404... otherwise,
    #   check there are no errors, since we might
    #   get errors even with a 200 OK (what?!)
    if response.status != 200 || response.body.meta.keys.include?("errors")
      raise StandardError, "Can't get the recipe"
    end

    response.body.data.recipe
  end

  private

  def api_base
    "https://api.din.co"
  end
end
