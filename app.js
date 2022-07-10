const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String,
});
const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema],
});
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listsSchema);


app.get("/", (req, res) => {
    Item.find({}, (err, foundItems) => {
        if (err) {
            console.log(err);
        } else {
            res.render("list", {
                listTitle: "Today",
                items: foundItems,
            });
        }
    });
});

app.get("/:customList", (req, res) => {
    const customListName = _.capitalize(req.params.customList);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                List.create({
                    name: customListName,
                    items: [],
                });
                res.redirect("/"+ customListName);
            } else {
                res.render("list", {
                    listTitle: foundList.name,
                    items: foundList.items
                });
            }
        } else {
            console.log(err);
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (req.body.list === "Today") {
        Item.create({
            name: itemName
        });
        res.redirect("/");
    } else {
        List.findOne({name:listName},(err,foundList)=>{
            if (err) {
                console.log(err);
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+ listName);
            }
        });
        
    }
});

app.post("/delete", (req, res) => {
    const listName = req.body.listName;
    const checkItemId = req.body.checkbox;
    if (listName === "Today") {
        Item.deleteOne({_id: checkItemId},(err) => {
                if (!err) {
                    console.log("Successfully deleted one item");
                }
                setTimeout(() => {
                    res.redirect("/");
                }, 100);
            }
        );
    } else {
        List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkItemId}}},(err, foundList)=>{
            if (!err) {
                setTimeout(() => {
                    res.redirect("/"+listName);
                }, 100);
            }   
        });
        
    }
    
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
