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

//create table users (email varchar(100), pwd varchar(100), mobile varchar(20), fullname varchar(100), dob date , bloodgroup varchar(20), gender varchar(30), address varchar(200), city varchar(100), state varchar(100), medhistory varchar(300));

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

app.get("/fetch-contact", function (req, resp) {
  console.log(req.query);
  mysql.query(
    "select * from users where email=?",
    [req.query.kuchEmail],
    function (err, resultJsonAry) {
      if (err != null) {
        alert("Invalid Infomation");
        console.log(err);
        resp.send(err);
        return;
      }
      console.log(resultJsonAry);
      resp.send(resultJsonAry);
    }
  );
});
//   create table reviews(rid int auto_increment primary key,email varchar(100), message varchar(1000));
app.get("/message-sent", function (req, resp) {
  console.log(req.query);
  mysql.query(
    "insert into reviews values(?,?,?)",
    [0, req.query.kuchEmail, req.query.kuchMsg],
    function (err) {
      if (err != null) {
        // alert("Invalid Infomation");
        console.log(err);
        resp.send(err);
        return;
      }
      console.log("Response Sent !");
      resp.send("Response Sent !");
    }
  );
});

app.get("/fetch-one", function (req, resp) {
  console.log(req.query);
  mysql.query(
    "select * from users where email=?",
    [req.query.kuchEmail],
    function (err, resultJsonAry) {
      if (err != null) {
        alert("Invalid Infomation");
        // console.log(err);
        resp.send(err);
        return;
      }
      // console.log(resultJsonAry);
      resp.send(resultJsonAry);
    }
  );
});

app.post("/profile-save", function (req, resp) {
  const email = req.body.txtEmail;
  const fullname = req.body.txtName;
  const mobile = req.body.txtMobile;
  const address = req.body.txtAdd;
  const city = req.body.selCity;
  const state = req.body.selState;
  const gender = req.body.selGender1;
  const bloodgroup = req.body.selBlood;
  const medhistory = req.body.txtMedHis;
  const dob=req.body.txtDate;
  //   //pic-uploading

  //   let filename;
  //   if (req.files == null) {
  //     filename = "nopic.jpg";
  //   } else {
  //     filename = req.files.ppic.name;
  //     let path = process.cwd() + "/public/uploads/" + filename;
  //     req.files.ppic.mv(path);
  //   }
  //   req.body.ppic = filename; //why this?

  mysql.query(
    "update users set fullname=?,dob=?, mobile=?, address=?,gender=? ,city=?, state=?, bloodgroup=?,medhistory=? where email=? ",
    [fullname,dob,mobile,address,gender, city, state,bloodgroup,medhistory, email],
    function (err, respJson) {
      if (err == null) {
        console.log("RECORD UPDATED SUCCESSFULLY");
        // window.location = '/Frontend/html/customer-profile.html';
        // return;
        resp.send("RECORD UPDATED SUCCESSFULLY");
      } else {
        resp.send(err.message);
      }
    }
  );
});

app.get("/request-blood",function(req,resp){
    
})
