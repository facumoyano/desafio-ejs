const express = require("express");
const path = require("path");
const productsRouter = require("./routes/products");
const Contenedor = require("./Contenedor");

let contenedor = new Contenedor("contenedor");

const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
    );
});
server.on("error", (error) => console.log(`error ${error}`));

app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("pages/form");
});

app.post("/api/productos", (req, res) => {
    const { body } = req;

    (async () => {
        await contenedor.save(body).then((response) => {
            res.json(response);
        });
    })();
    res.redirect("/productos");
});

app.get("/productos", (req, res) => {
    (async () => {
        await contenedor.getAll().then((response) => {
            if (response) {
                res.render("pages/productslist", {
                    products: response,
                    productsExist: true,
                });
            } else {
                res.render("pages/error", {
                    message: "No hay productos",
                });
            }
        });
    })();
});

app.use("/api/productos", productsRouter);
