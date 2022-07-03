const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let items= [];

app.get("/", (req, res) => {
    const today = new Date();
    let options = {
        weekday: "long",
        day: 'numeric', 
        month: 'long'
    };
    const whichDay = today.toLocaleDateString("en-US", options);
    res.render("list", {
        whichDay: whichDay,
        items: items
    });
});

app.post("/", (req, res) => {
   items.push(req.body.newItem); 
   res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
