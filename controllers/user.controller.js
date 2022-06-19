var User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var fs = require("file-system");
const { type } = require("os");

module.exports.index = async function (req, res) {
  var users = await User.find();
  res.json(users);
};
module.exports.list = async function (req, res) {
  var users = await User.find();
  res.json(users);
};
module.exports.listId = function (req, res) {
  var id = req.params.id;
  User.findById({ _id: id }).then(function (users) {
    res.json(users);
  });
};
module.exports.info = function (req, res) {
  var id = req.params.id;
  User.findById({ _id: id }).then(function (users) {
    res.json(users);
  });
};
module.exports.postLogin = async function (req, res) {
  var email = req.body.loginEmail;
  var password = req.body.loginPassword;

  var user = await User.findOne({ userEmail: email });

  if (!user) {
    return res.status(400).send("Email is not found!");
  }

  const validPassword = await bcrypt.compare(password, user.userPassword);
  if (!validPassword) {
    return res.status(400).send("Wrong password!");
  }

  const token = jwt.sign({ user }, "hahaha");
  res.status(200).json({ token: token, user: user });
};
module.exports.register = async function (req, res) {
  var password = req.body.userPassword;
  var user = await User.findOne({ userEmail: req.body.userEmail });

  if (user) {
    return res.status(400).send("Email already exists!");
  }

  try {
    const salt = await bcrypt.genSalt();
    req.body.password = await bcrypt.hash(password, salt);
  } catch {}

  const data = {
    userAvt:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    userName: req.body.userName,
    userTinh: "",
    userHuyen: "",
    userAddress: "",
    userPhone: "",
    userEmail: req.body.userEmail,
    userPassword: req.body.password,
    userRole: req.body.userRole,
    userCreateDay: new Date(),
  };

  await User.create(data);
  res.status(200).send("Register success");
};
module.exports.updateUser = async function (req, res) {
  var id = req.params.id;

  if (req.files.length > 0) {
    const imgArr = [];
    req.files.map((item) => {
      // imgArr.push(
      //   `http://localhost:4000/${item.path.split("\\").slice(1).join("/")}`
      // );
      var img = fs.readFileSync(item.path);
      var encode_image = img.toString("base64");
      var finalImg = new Buffer.from(encode_image, "base64");
      imgArr.push(finalImg.toString("base64"));
    });
    const img = {
      userAvt: imgArr[0],
    };
    const data = {
      userAvt: imgArr[0],
      userName: req.body.userName,
      userTinh: req.body.userTinh,
      userHuyen: req.body.userHuyen,
      userAddress: req.body.userAddress,
      userPhone: req.body.userPhone,
      userEmail: req.body.userEmail,
      userCreateDay: new Date(),
    };

    User.findByIdAndUpdate({ _id: id }, data, function (error) {});
  }

  if (req.body.userPassword !== "") {
    try {
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.userPassword, salt);
    } catch {}
    await User.findByIdAndUpdate(
      { _id: id },
      { userPassword: req.body.password },
      function (error) {}
    );
  }

  if (req.body.fromAdmin) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        userRole: req.body.userRole,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
      },
      function (error) {}
    );
  } else {
    const data = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userTinh: req.body.userTinh,
      userHuyen: req.body.userHuyen,
      userPhone: req.body.userPhone,
      userAddress: req.body.userAddress,
    };
    await User.findByIdAndUpdate({ _id: id }, data, function (error) {});
  }

  var user = await User.findOne({ _id: id });

  const token = jwt.sign({ user }, "hahaha");
  res.status(200).json({ token: token, user: user });
};

module.exports.deleteUser = async function (req, res) {
  await User.findByIdAndRemove({ _id: req.body.id });
  res.status(200).send("ok");
};
