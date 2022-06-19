var Product = require("../models/product.model.js");
var Email = require("../models/email.model");
var mongoose = require("mongoose");
var fs = require("file-system");

var nodemailer = require("nodemailer");
const { buffer } = require("stream/consumers");

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

module.exports.index = async function (req, res) {
  var products = await Product.find();
  res.json(products);
};

module.exports.product = function (req, res) {
  var id = req.params.id;
  Product.findById({ _id: id }).then(function (products) {
    res.json(products);
  });
};

module.exports.postProduct = async function (req, res) {
  const imgArr = [];
  req.files.map((item) => {
    // imgArr.push(
    //   `http://localhost:4000/${item.path.split("\\").slice(1).join("/")}`
    // );
    var img = fs.readFileSync(item.path);
    var encode_image = img.toString("base64");
    var finalImg = new Buffer.from(encode_image, "base64");
    imgArr.push(finalImg);
  });

  const data = {
    productName: req.body.productName,
    productSale: req.body.productSale,
    productPrice: req.body.productPrice,
    productFinalPrice:
      req.body.productPrice -
      req.body.productPrice * (req.body.productSale / 100),
    productGroupCate: req.body.productGroupCate,
    productCate: req.body.productCate,
    productType: req.body.productType,
    productDate: req.body.productDate,
    productImg: imgArr,
    productDes: req.body.productDes,
    productSpec: JSON.parse(req.body.productSpec),
    productSold: 0,
  };

  await Product.create(data);

  // var emailList = await Email.find();

  // for (let i in emailList) {
  //   Email.findOne({ _id: emailList[i]._id })
  //     .updateOne({
  //       $push: {
  //         sendedEmail: {
  //           emailId: new mongoose.mongo.ObjectId(),
  //           isSeen: false,
  //         },
  //       },
  //     })
  //     .exec();

  //   var emailInfo = await Email.findById(emailList[i]._id);

  //   var mailOptions = {
  //     from: "18521118@gm.uit.edu.vn",
  //     to: emailList[i].subscriberEmail,
  //     subject: "Sản phẩm mới tại SOBER SHOP",
  //     html:
  //       "<p>Sản phẩm mới nè</p>" +
  //       `<img src="http://localhost:4000/email/${emailList[i]._id}/${
  //         emailInfo.sendedEmail[emailInfo.sendedEmail.length - 1].emailId
  //       }" alt=""></img>`,
  //   };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log("Email sent: " + info.response);
  //     }
  //   });
  // }

  res.status(200).send("ok");
};

module.exports.updateProduct = async function (req, res) {
  var id = req.params.id;

  if (req.body.deleteImgId) {
    const product = await Product.findById(id);
    const deletedProduct = [...product.productImg];
    deletedProduct.splice(req.body.deleteImgId, 1);
    const deletedData = {
      productName: product.productName,
      productSale: product.productSale,
      productPrice: product.productPrice,
      productCate: product.productCate,
      productType: product.productType,
      productDate: product.productDate,
      productImg: deletedProduct,
      productDes: product.productDes,
      productSpec: product.productSpec,
      productSold: 0,
    };
    await Product.findByIdAndUpdate(id, deletedData, function (error) {
      if (error) {
        console.log(error);
      }
    });
  } else {
    const imgArr = [];
    if (req.files) {
      req.files.map((item) => {
        // imgArr.push(
        //   `http://localhost:4000/${item.path.split("\\").slice(1).join("/")}`
        // );
        var img = fs.readFileSync(item.path);
        var encode_image = img.toString("base64");
        var finalImg = new Buffer.from(encode_image, "base64");
        imgArr.push(finalImg);
      });
    }
    const img = {
      productImg: imgArr,
    };
    const data = {
      productName: req.body.productName,
      productSale: req.body.productSale,
      productPrice: req.body.productPrice,
      productFinalPrice:
        req.body.productPrice -
        req.body.productPrice * (req.body.productSale / 100),
      productCate: req.body.productCate,
      productGroupCate: req.body.productGroupCate,
      productType: req.body.productType,
      productDes: req.body.productDes,
      productSpec: JSON.parse(req.body.productSpec),
    };

    Product.findByIdAndUpdate({ _id: id }, { $push: img }, function (error) {});

    Product.findByIdAndUpdate(id, data, function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
  res.status(200).send("ok");
};

module.exports.reviewProduct = async function (req, res) {
  var id = req.params.id;

  Product.findByIdAndUpdate(
    { _id: id },
    { $push: { productVote: req.body } },
    function (error) {}
  );
  res.status(200).send("ok");
};

module.exports.deleteProduct = async function (req, res) {
  await Product.findByIdAndRemove({ _id: req.body.productId });
  res.status(200).send("ok");
};
