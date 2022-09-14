let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

let dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "classroom_api",
});

dbConn.connect();

app.get("/", (req, res) => {
  return res.send({
    error: false,
    message: "Welcome to the database server",
  });
});

app.get("/locations", (req, res) => {
  dbConn.query("SELECT * FROM locations", (error, results, fields) => {
    if (error) throw error;

    let message = "";

    if (results === undefined || results.length == 0) {
      message = "No location available.";
    } else {
      message = "Successfully get location";
    }

    return res.send({
      error: false,
      data: results,
      message,
    });
  });
});

app.post("/locations", (req, res) => {
  let title = req.body.title;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  if (!title || !latitude || !longitude) {
    return res.status(400).send({
      error: true,
      message: "Invalid data provided",
    });
  } else {
    dbConn.query(
      "INSERT INTO locations (title, latitude,longitude) VALUES (?, ?,?)",
      [title, latitude, longitude],
      (error, results, fields) => {
        if (error) throw error;

        return res.send({
          error: false,
          data: results,
          message: "Successfully Add location",
        });
      }
    );
  }
});

app.delete("/locations/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
    return res.status(400).send({
      error: true,
      message: "Please provide a valid id",
    });
  } else {
    dbConn.query(
      "DELETE FROM locations WHERE id = ?",
      [id],
      (error, result) => {
        if (error) throw error;

        let message;

        if (result.affectedRows === 0) {
          message = "id not found";
        } else {
          message = "Successfully deleted";
        }

        return res.status(200).send({
          error: false,
          data: result,
          message,
        });
      }
    );
  }
});

app.listen(8000, (req, res) => {
  console.log("Node server is listening on port 8000");
});

module.exports = app;
