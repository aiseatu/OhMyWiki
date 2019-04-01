const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "testuser",
        email: "test@example.com",
        password: "1234567"
      })
      .then((user) => {
        this.user = user;
        Wiki.create({
          title: "Rabbits",
          body: "Rabbits are cute!",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /wikis", () => {

    it("should respond with all wikis", (done) => {
      request.get(base, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Rabbits");
        done();
      });
    });

  });

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });

  });

  describe("POST /wikis/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Dogs",
        body: "Dogs are cute too!"
      }
    };

    it("should create a new wiki", (done) => {
      console.log(this.user.id);
      request.post(options, (err, res, body) => {
        console.log(res.statusCode);
        Wiki.findOne({where: {title: "Dogs"}})
        .then((wiki) => {
          expect(wiki.title).toBe("Dogs");
          expect(wiki.body).toBe("Dogs are cute too!");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

  });

});
