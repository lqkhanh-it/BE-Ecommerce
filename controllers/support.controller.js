var Email = require("../models/email.model");
var Support = require("../models/support.model");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");

// Login with admin email
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreplytechcompany@gmail.com",
    pass: "0933997980",
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Kết nối thành công!");
  }
});
// module.exports.index = async function (req, res) {
//   console.log("check");

//   Email.findOneAndUpdate(
//     { _id: req.params.idUser, "sendedEmail.emailId": req.params.idEmail },
//     {
//       $set: {
//         "sendedEmail.$.isSeen": true,
//       },
//     },
//     function (error) {
//       if (error) {
//         console.log(error);
//       }
//     }
//   );

//   var emailList = await Email.find();

//   res.send(emailList);
// };
module.exports.list = async function (req, res) {
  var supports = await Support.find();
  res.json(supports);
};
module.exports.info = function (req, res) {
  var id = req.params.id;
  Support.findById({ _id: id }).then(function (support) {
    res.json(support);
  });
};
module.exports.updateSupport = function (req, res) {
  var id = req.params.id;
  Support.findByIdAndUpdate(id, req.body, function (error) {
    if (error) {
      console.log(error);
    }
  });
  var mailOptions = {
    from: "noreplytechcompany@gmail.com",
    to: req.body.email,
    subject: "Phản hồi hỗ trợ",
    html: req.body.response,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).send("ok");
};
module.exports.postSupport = async function (req, res) {
  console.log(req.body);
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    content: req.body.content,
    status: "new",
  };

  await Support.create(data);

  res.status(200).send(data);
};
module.exports.deleteSupport = async function (req, res) {
  await Support.findByIdAndRemove({ _id: req.body.id });
  res.status(200).send("ok");
};
