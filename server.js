const express = require("express");
const app = express();
const fileuploader = require("express-fileupload");
const mysql2 = require("mysql2");

app.listen(2709, function () {
  console.log("Server STARTED at 2709 :)");
});

app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
app.use(express.static("Frontend"));

const objConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "Admin123",
    database: "BloodBridgeDB",
    dateStrings: true, //isse hum date ko bhi fetch kr paate hain
  };
  
  const mysql = mysql2.createConnection(objConfig);
  
  mysql.connect(function (err) {
    if (err == null) console.log("Connected to database");
    else console.log(err.message);
  });

  app.get("/", function (req, resp) {
    let filepath = process.cwd() + "/Frontend/html/login.html";
    resp.sendFile(filepath);
  });

  app.get("/sign_up", function (req, resp) {
    const email = req.query.kuchEmail;
    const pwd = req.query.kuchPass;
    const mob = req.query.kuchMob;
  
    console.log(req.query);
  
    mysql.query(
      "select * from users where email=?",
      [email],
      function (err, resultJsonAry) {
        if (resultJsonAry.length == 1) {
          console.log("Email id already exist");
          resp.send("Email id already exist");
        } else {
          mysql.query(
            "insert into users(email,pwd,mobile) values(?,?,?)",
            [email, pwd, mob],
            function (err) {
              if (err == null) {
                console.log("Signup Successful");
                resp.send("Signup Successful");
              } else {
                console.log(err.message);
                resp.send(err);
              }
            }
          );
        }
      }
    );
  });

  app.get("/login", function (req, resp) {
    console.log(req.query);
    //login query
    mysql.query(
      "select * from users where email=? and pwd=?",
      [req.query.loginEmail, req.query.loginPwd],
      function (err, resultJsonAry) {
        //console.log(JSON.stringify(resultJsonAry));
  
        if (err != null) {
          console.log(err);
          resp.send(err);
          return;
        }
  
        if (resultJsonAry.length == 1) {
           {
            console.log("Login successful");
            resp.send("Login Done");
          }
        } else {
          console.log("Invalid email or password.");
          resp.send("Invalid Email or Password");
        }
      }
    );
  });