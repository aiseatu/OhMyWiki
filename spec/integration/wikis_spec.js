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
        //console.log(this.user);
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
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 0,
          userId: this.user.id,
          email: this.user.email
        }
      });
      done();

      // User.create({
      //   username: "member",
      //   email: "member@example.com",
      //   password: "1234567",
      //   role: 0
      // }).then((user) => {
      //   request.get({
      //     url: "http://localhost:3000/auth/fake",
      //     form: {
      //       role: user.role,
      //       userId: user.id,
      //       email: user.email
      //     }
      //   },
      //     (err, res, body) => {
      //       done();
      //     }
      //   );
      // });
    });

    const options = {
      url: `${base}create`,
      form: {
        title: "Dogs",
        body: "Dogs are cute too!"
      }
    };

    it("should create a new wiki", (done) => {

      request.post(options, (err, res, body) => {
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

  describe("GET /wikis/:id", () => {

    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Rabbits");
        done();
      });
    });

  });

  describe("POST /wikis/:id/destroy", () => {

    // beforeEach((done) => {
    //   request.get({
    //     url: "http://localhost:3000/auth/fake",
    //     form: {
    //       role: 0,
    //       userId: 1,
    //     }
    //   });
    //   done();
    // });

    it("should delete the wiki with the associated ID", (done) => {

      expect(this.wiki.id).toBe(1);
      request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
        Wiki.findById(1)
        .then((wiki) => {
          expect(err).toBeNull();
          expect(wiki).toBeNull();
          done();
        })
      });
    });

  });

  describe("GET /wikis/:id/edit", () => {

    it("should render a view with an edit wiki form", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit");
        expect(body).toContain("Rabbits");
        done();
      });
    });

  });

  describe("POST /wikis/:id/update", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 0,
          userId: this.user.id,
        }
      });
      done();
    });

    it("should update wiki with given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Holland lop",
          body: "Smallest bunny."
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Wiki.findOne({where: {id: this.wiki.id}})
        .then((wiki) => {
          expect(wiki.title).toBe("Holland lop");
          done();
        });
      });
    });

  });



});
