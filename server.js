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
//create table reviews(rid int auto_increment primary key,email varchar(100), message varchar(1000));
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
  const dob = req.body.txtDate;
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
    [
      fullname,
      dob,
      mobile,
      address,
      gender,
      city,
      state,
      bloodgroup,
      medhistory,
      email,
    ],
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
// create table bloodbanks(bbname varchar(100), city varchar(100), Apos varchar(10),Bpos varchar(10),ABpos varchar(10),Opos varchar(10),Aneg varchar(10),Bneg varchar(10),ABneg varchar(10),Oneg varchar(10));
// app.get("/request-blood",function(req,resp){
// console.log(req.query);
// const units=req.query.kuchUnits;
// const bloodgroup=req.query.bloodgroup;
// const city= req.query.city;

// mysql.query("SELECT * FROM bloodbanks WHERE city=? and CASE WHEN ? = 'A+' THEN Apos  WHEN ? = 'B+' THEN Bpos WHEN ? = 'AB+' THEN ABpos WHEN ? = 'O+' THEN Opos WHEN ? = 'A-' THEN Aneg WHEN ? = 'B-' THEN Bneg WHEN ? = 'AB-' THEN ABneg WHEN ? = 'O-' THEN Oneg END >= ?;",[city,bloodgroup,bloodgroup,bloodgroup,bloodgroup,bloodgroup,bloodgroup,bloodgroup,bloodgroup,units],function(err,respJsonAry){
//     console.log("i am here")
//     if(err!=null){
//         resp.send(err);
//     }
//     console.log(respJsonAry);
//     resp.send(respJsonAry);
// })

// })
// //create table requests(rid int auto_increment primary key,email varchar(100), fullname varchar(100), mobile varchar(20), gender varchar(10), city varchar(100),state varchar(100), bloodgroup varchar(10), dob date, hospitalname varchar(100), hospitalid varchar(100), medhistory varchar(1000));

app.get("/search-blood", function (req, resp) {
  console.log(req.query);
//   const units = req.query.kuchUnits;
  const bloodgroup = req.query.kuchBlood;
  const city = req.query.kuchCity;
  mysql.query(
    "SELECT * FROM bloodbanks WHERE city=? and CASE WHEN ? = 'Apos' THEN Apos  WHEN ? = 'Bpos' THEN Bpos WHEN ? = 'ABpos' THEN ABpos WHEN ? = 'Opos' THEN Opos WHEN ? = 'Aneg' THEN Aneg WHEN ? = 'Bneg' THEN Bneg WHEN ? = 'ABneg' THEN ABneg WHEN ? = 'Oneg' THEN Oneg END >= 0;",
    [
      city,
      bloodgroup,
      bloodgroup,
      bloodgroup,
      bloodgroup,
      bloodgroup,
      bloodgroup,
      bloodgroup,
      bloodgroup
    ],
    function (err, respJsonAry) {
      console.log("i am here");
      if (err != null) {
        resp.send(err);
      }
      console.log(respJsonAry);
      resp.send(respJsonAry);
    }
  );
});

app.get("/save-donation", function (req,resp) {
  const email = req.query.kuchEmail;
  const fullname = req.query.kuchName;
  const mobile = req.query.kuchMobile;
    const address = req.query.kuchAdd;
  const city = req.query.kuchCity;
  const state = req.query.kuchState;
  const gender = req.query.kuchGender;
  const bloodgroup = req.query.kuchBlood;
  const medhistory = req.query.kuchMedHis;
  const dob = req.query.kuchDate;
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
    "insert into bloodDonations values(0,?,?,?,?,?,?,?,?,?,current_date); ",
    [
      email,
      mobile,
      fullname,
      dob,
      bloodgroup,
      gender,
      city,
      state,
      medhistory,
    ],
    function (err, respJson) {
      if (err == null) {
        console.log("Registered Successfully");
        // window.location = '/Frontend/html/customer-profile.html';
        // return
        resp.send("Registered Successfully");
      } else {
        resp.send(err.message);
      }
    }
  );
});

app.get("save-request",function(req,resp){
    const email = req.query.kuchEmail;
    const fullname = req.query.kuchName;
    const mobile = req.query.kuchMobile;
    //   const address = req.query.kuchAdd;
    const city = req.query.kuchCity;
    const state = req.query.kuchState;
    const gender = req.query.kuchGender;
    const bloodgroup = req.query.kuchBlood;
    const medhistory = req.query.kuchMedHis;
    const dob = req.query.kuchDate;
    const hospitalname=req.query.kuchHospitalName;
    const hospitalid=req.query.kuchHospitalId;
    const units=req.query.kuchUnits;

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
  console.log(req.query);
    mysql.query(
      "insert into requests values(0,?,?,?,?,?,?,?,?,?,?,?,?,current_date); ",
      [
        email,
        fullname,
        mobile,
        gender,
        city,
        state,
        bloodgroup,
        dob,
        hospitalname,
        hospitalid,
        medhistory,
        units
      ],
      function (err, respJson) {
        if (err == null) {
          console.log("Request sent Successfully");
          // window.location = '/Frontend/html/customer-profile.html';
          // return
          resp.send("Request sent Successfully");
        } else {
            console.log(err);
          resp.send(err);
        }
      }
    );
})