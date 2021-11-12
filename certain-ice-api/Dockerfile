FROM ruby:3

WORKDIR /api

RUN gem install bundler

# Install the Gems
COPY ./Gemfile ./Gemfile.lock /api/
RUN bundle install

EXPOSE 3000

ENV RAILS_ENV development
CMD bundle exec rake db:migrate && bundle exec rails s -b 0.0.0.0