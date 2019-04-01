const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "testuser",
        email: "testuser@example.com",
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

  describe("#create()", () => {

    it("should create a wiki", (done) => {
      Wiki.create({
        title: "Dogs",
        body: "Dogs are cute too!",
        private: false,
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki).not.toBeNull();
        expect(wiki.title).toBe("Dogs");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a wiki without title or body", (done) => {
      Wiki.create({
        body: "Dogs are cute too!",
        private: false,
        userId: this.user.id
      })
      .then((wiki) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.title cannot be null");
        done();
      });
    });

  });

  describe("#getUser()", () => {

    it("should return the associated user", (done) => {
      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.username).toBe("testuser");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });
  
});
