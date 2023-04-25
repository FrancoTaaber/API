const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

const loginUser = async () => {
    const res = await chai
        .request(server)
        .post("/tokens")
        .send({ email: "test@example.com", password: "password" });
    return res.body.token;
};

describe("API", () => {
    let token;
    let createdPhotoId;

    before(async () => {
        token = await loginUser();
    });

    describe("GET /photos", () => {
        it("should GET all photos", (done) => {
            chai.request(server)
                .get("/photos")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    describe("GET /photos/:id", () => {
        it("should GET a photo by the given id", (done) => {
            const id = 1;
            chai.request(server)
                .get("/photos/" + id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("id").eql(id);
                    done();
                });
        });
    });

    it("should POST a new photo", async () => {
        const photo = {
            title: "Test Photo",
            url: "https://example.com/test.jpg",
        };
        const res = await chai
            .request(server)
            .post("/photos")
            .set("Authorization", `Bearer ${token}`)
            .send(photo);
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("title").eql(photo.title);
        res.body.should.have.property("url").eql(photo.url);

        createdPhotoId = res.body.id;
    });

    it("should UPDATE a photo by the given id", async () => {
        const updatedPhoto = {
            title: "Updated Test Photo",
            url: "https://example.com/updated-test.jpg",
        };
        const res = await chai
            .request(server)
            .put(`/photos/${createdPhotoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedPhoto);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("title").eql(updatedPhoto.title);
        res.body.should.have.property("url").eql(updatedPhoto.url);
    });

    it("should DELETE a photo by the given id", async () => {
        const res = await chai
            .request(server)
            .delete(`/photos/${createdPhotoId}`)
            .set("Authorization", `Bearer ${token}`);
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Photo deleted successfully");
    });
});
