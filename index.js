const express = require("express");
const app = express();

const mongoose = require("mongoose");

const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

app.set("port", process.env.PORT || 5000);

app.use(cors());
// parse application/json

app.use(bodyParser.json());

app.use(cors({ origin: "https://clientportal.netlify.app", credentials: false }));

//  MonngoDb Connect
mongoose.connect(
  "mongodb+srv://clientportal:ql7yO5pYv0v7tGAx@cluster0.2du46.mongodb.net/clientportal",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected !!");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);
// Routes

// SignUp post route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered, Please login now." });
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// const getAccessToken = () => {
let access_token;
axios
  .post(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN }&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
  )
  .then(function (response) {
    access_token = response.data.access_token;
  })
  .catch(function (error) {
    access_token = error;
  });
//         return access_token
// }

// Start  for zoho project

// let access_token_for_zoho_project;
// axios
//   .post(
//     `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN_ZOHO_PROJECT}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
//   )
//   .then(function (response) {
//     access_token_for_zoho_project = response.data.access_token_for_zoho_project;
//   })
//   .catch(function (error) {
//     access_token_for_zoho_project = error;
//   });

// End for zoho Project

app.get("/test", (req, res) => {
  // console.log(access_token);
  // console.log(getAccessToken());
  res.status(200).json(access_token);
});

app.get("/projecttest", (req, res) => {
  res.status(200).json(access_token);
});

// Get Data Contact modeules
app.get("/getdata", (req, res) => {
  axios
    .get(`https://zohoapis.com/crm/v2/Contacts`, {
      headers: {
        Authorization: `Zoho-oauthtoken  ${access_token}`,
      },
    })
    .then(function (response) {
      res.status(200).json(response.data);
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Insert Data

app.post("/insert", (req, res) => {
  console.log(req);
  let requestBody = JSON.stringify({ data: [req.body] });
  // console.log(body);

  // console.log(JSON.stringify(body));

  axios
    .post(`https://zohoapis.com/crm/v2/Contacts`, requestBody, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    })
    .then(function (response) {
      console.log(response);
      // res.send(200).json(response.data)
      // console.log(response);
      console.log("hello");
      res.sendStatus(200);
    })
    .catch(function (res) {
      console.log(res);
      res.sendStatus(res.status);
    });
});

// Delete Data

app.post("/delete/:id", (req, res) => {
  console.log(req.params.id);

  axios
    .delete(`https://zohoapis.com/crm/v2/Contacts/${req.params.id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    })
    .then(function (response) {
      console.log(response);
      console.log("hello");
      res.sendStatus(200);
    })
    .catch(function (res) {
      console.log(res);
      res.sendStatus(res.status);
    });
});

// Deals modiul data get
app.get("/getdeals", (req, res) => {
  axios
    .get(`https://zohoapis.com/crm/v2/Deals`, {
      headers: {
        Authorization: `Zoho-oauthtoken  ${access_token}`,
      },
    })
    .then(function (response) {
      res.status(200).json(response.data);
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// get Products

app.get("/getproducts", (req, res) => {
  axios
    .get(`https://zohoapis.com/crm/v2/Products`, {
      headers: {
        Authorization: `Zoho-oauthtoken  ${access_token}`,
      },
    })
    .then(function (response) {
      res.status(200).json(response.data);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// get zoho Projectssadfas

app.get("/getprojects", (req, res) => {
  axios
    .get(`https://projectsapi.zoho.com/restapi/portals/`, {
      headers: {
        Authorization: `Zoho-oauthtoken  ${access_token}`,
      },
    })
    .then(function (response) {
      res.status(200).json(response.data);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

// update Data
app.listen(app.get("port"), function () {
  console.log("Node app is running at http://localhost:" + app.get("port"));
});
