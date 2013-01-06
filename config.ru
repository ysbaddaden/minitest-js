require 'sinatra'
ROOT = File.expand_path('..', __FILE__)
set :public_folder, ROOT
set :static_cache_control, 'no-cache, must-revalidate'
run Sinatra::Application
