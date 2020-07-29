# OhMyWiki

This is a web app inspired by Wikipedia. It incorporated features including Markdown, Stripe checkout, Sendgrid, etc.

## Built with
* [React](https://reactjs.org/) - The front-end library
* [Node](https://nodejs.org/en/) - Javascript runtime for server-side management
* [Postgresql](https://www.postgresql.org/) - For database management

## Getting Started

1. Clone the responsitory to your local computer

2. Run `npm install` from the root directory to install the back-end dependencies, then `cd` into the client directory and run `npm install` to install the front-end dependencies.

3. Create database and configure the database by `cd ..` back into the root directory and run `sequelize db:create` `sequelize db:migrate`

4. Lastly (from the root directory) run `npm run dev` to start the server + client side concurrently

## Running the App

The App has the following features:

1, standard user sign up, sign in & sign out
![Screenshot of landing page](https://imgur.com/Ydl6PMq)

2, perform CRUD on Wikis
![Screenshot of wiki page](https://imgur.com/lG6gpyf)

3, Allows standard users to upgrade to premium in order to use private Wiki feature and invite collaborators
![Screenshot of sendgrid page](https://imgur.com/whr7LFM)
