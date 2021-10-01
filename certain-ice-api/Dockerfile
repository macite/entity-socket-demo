FROM ruby:3

WORKDIR /api

RUN gem install bundler

# Install the Gems
COPY ./Gemfile ./Gemfile.lock /api/
RUN bundle install

EXPOSE 3000
EXPOSE 3334

ENV RAILS_ENV development
CMD rails s -b 0.0.0.0