const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const config = require("config");

const app = express();
app.use(express.json());

const db = config.get("mongoURI");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

//READ Request Handlers
app.get("/", (req, res) => {
  res.send("HashTaag");
});

app.get("/state", (req, res) => {
  MongoClient.connect(db, function(err, client) {
    if (err) throw err;
    const db = client.db("HashTaag");
    var id = req.query.q;

    db.collection("City-list")
      .find({ "State/Union territory*": new RegExp(id, "i") })
      .map(s => {
        return {
          state: s["State/Union territory*"],
          district_code: s["District Code"],
          district: s["District"]
        };
      })
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });
});

app.get("/town", (req, res) => {
  MongoClient.connect(db, function(err, client) {
    if (err) throw err;
    const db = client.db("HashTaag");
    var id = req.query.q;

    db.collection("City-list")
      .find({ "City/Town": new RegExp(id, "i") })
      .map(s => {
        return {
          town: s["City/Town"],
          state: s["State/Union territory*"],
          district: s["District"]
        };
      })
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });
});

app.get("/district", (req, res) => {
  MongoClient.connect(db, function(err, client) {
    if (err) throw err;
    const db = client.db("HashTaag");
    var id = req.query.q;

    db.collection("City-list")
      .find({ District: new RegExp(id, "i") })
      .map(s => {
        return {
          town: s["City/Town"],
          Urban_status: s["Urban Status"],
          State_code: s["State Code"],

          state: s["State/Union territory*"],
          District_code: s["District Code"],
          District: s["District"]
        };
      })
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });
});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
