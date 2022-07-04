const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = [];
let workItems = [];

app.get("/", (req, res) => {
    let whichDay = date.getDate();
    res.render("list", {
        listTitle: whichDay,
        items: items
    });
});

app.get("/work", (req, res) => {
    res.render("list", {
        items: workItems,
        listTitle: "Work List",
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.post("/", (req, res) => {
    if (req.body.list === "Work") {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem);
        res.redirect("/");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
