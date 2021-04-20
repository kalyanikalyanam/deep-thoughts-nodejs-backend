const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Language = require("../models/Language");
const Age = require("../models/Age");
const Genre = require("../models/Genre");
const Parental = require("../models/Parentalgauidance");
const Creator = require("../models/Creator");
var url = require("url");

const axios = require("axios");

const { render } = require("ejs");
const Video = require("../models/Video");
const multer = require("multer");
var ip = require("ip");
var moment = require("moment");
const Category = require("../models/Category");
const Favorites = require("../models/Favorites");
const Company = require("../models/Company");
const Payment = require("../models/Payment");
const Currency = require("../models/Currency");
const { query } = require("express");
const Auth = require("../models/Auth");
const Watchhistory = require("../models/Watchhistory");
const Subscription = require("../models/Subscription");
const Banner = require("../models/Banner");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("login"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Video.find((err, video) => {
    if (err) {
      return res.status(401).send();
    }

    Auth.find((err, user) => {
      if (err) {
        return res.status(401).send();
      }

      Company.find((err, company) => {
        if (err) {
          console.log(err);
        }

        res.render("dashboard", {
          user: req.user,
          company: company,
          video: video,
          user: user,
        });
      });
    });
  });
});
router.get("/changepassword", ensureAuthenticated, function (req, res) {
  User.findById(req.user, (err, dat) => {
    if (err) {
      return res.status(401).send();
    }

    Company.find((err, company) => {
      if (err) {
        console.log(err);
      }

      res.render("changepassword", {
        student: dat,
        user: req.user,
        company: company,
      });
    });
  });
});

router.post("/changepassword", function (req, res) {
  const { password, passwordnew, passwordconfirm } = req.body;

  console.log(req.user);
  console.log(req.user._id + "id");

  User.findById(req.user._id, (err, data) => {
    if (err) {
      console.log(err);
    }

    bcrypt.compare(password, data.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        res.send({
          Error: "Password is Incorrect",
        });
      } else {
        data.password = req.body.passwordnew;

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(data.password, salt, (err, hash) => {
            if (err) throw err;

            data.password = hash;

            data.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
              res.redirect("/admin/dashboard");
            });
          });
        });
      }
    });
  });
});

router.get("/languages", (req, res) => {
  Language.find()
    .sort({
      language: 1,
    })
    .exec((err, language) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(language);
      }
    });
});

router.post("/Languages-add", (req, res) => {
  const Languagedata = new Language({
    language: req.body.language,
  });

  Languagedata.save()
    .then((err, language) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(language);
      }
    })
    .catch((err) => console.log(err));
});

router.post("/editlanguage/:id", (req, res, next) => {
  let lang = {};

  lang.language = req.body.language;

  let query = {
    _id: req.params.id,
  };

  Language.updateOne(query, lang, (err, language) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(language);
    }
  });
});

router.post("/deletelanguage/:id", (req, res) => {
  Language.remove(
    {
      _id: req.params.id,
    },
    (err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(age);
      }
    }
  );
});

router.get("/Age", ensureAuthenticated, (req, res) => {
  Age.find()
    .sort({
      age: 1,
    })
    .exec((err, age) => {
      if (err) {
        res.status(400).json("No age found");
      } else {
        res.status(200).json(age);
      }
    });
});

router.post("/Age-add", ensureAuthenticated, (req, res) => {
  const agedata = new Age({
    age: req.body.age,
  });

  agedata
    .save()
    .then(err, (age) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({ status: "Age is added", age });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/editage/:id", ensureAuthenticated, (req, res, next) => {
  let ages = {};

  ages.age = req.body.age;

  let query = {
    _id: req.params.id,
  };

  Age.update(query, ages, (err) => {
    if (!err) {
      req.flash("success_msg", "grade is added");
      res.redirect("/admin/Age");
    } else {
      errors.push({
        msg: "failed",
      });
    }
  });
});

router.get("/editage/:id", ensureAuthenticated, (req, res) => {
  Age.findById(req.params.id, (err, age) => {
    if (err) {
      console.log(err);
    }

    Company.find((err, company) => {
      if (err) {
        console.log(err);
      }

      res.render("editage", {
        user: req.user,
        age: age,
        company: company,
      });
    });
  });
});

router.get("/deleteage/:id", ensureAuthenticated, (req, res) => {
  Age.remove(
    {
      _id: req.params.id,
    },
    (err) => {
      if (!err) {
        res.redirect("/admin/Age");
      } else {
        errors.push({
          msg: "failed",
        });
      }
    }
  );
});

router.get("/genre", (req, res) => {
  Genre.find()
    .sort({
      genre: 1,
    })
    .exec((err, genre) => {
      if (err) {
        res.status(400).json("No genre found");
      } else {
        res.status(200).json(genre);
      }
    });
});

var uploadimg = multer({
  storage: multer.diskStorage({
    destination: "./public/upload/",

    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()) +
        path.extname(file.originalname);
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".png" && ext !== ".jpg") {
      return callback("Only videos are allowed", null, false);
    }
    callback(null, true);
  },
});

router.post("/genreadd", uploadimg.any(), (req, res) => {
  try {
    const Genredata = new Genre({
      genre: req.body.genre,
      thumbnail: `http://localhost:3001/upload/${
        req.files[0] && req.files[0].filename ? req.files[0].filename : ""
      }`,
    });

    console.log(Genredata);

    Genredata.save().then((err, user) => {
      console.log(user);

      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({ status: "Genre is added", user });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/editGenre/:id", uploadimg.any(), (req, res, next) => {
  let Genres = {};

  Genres.genre = req.body.genre;
  Genres.thumbnail = `https://localhost:3001/upload/${
    req.files[0] && req.files[0].filename ? req.files[0].filename : ""
  }`;

  let query = {
    _id: req.params.id,
  };

  Genre.updateOne(query, Genres, (err, genre) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json({ status: "Genre is updated", genre });
    }
  });
});

router.post("/deleteGenre/:id", (req, res) => {
  Genre.remove(
    {
      _id: req.params.id,
    },
    (err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({ status: "Deleted" });
      }
    }
  );
});

router.get("/Parental", (req, res) => {
  Parental.find()
    .sort({
      parental: 1,
    })
    .exec((err, parental) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(parental);
      }
    });
});

router.post("/parental-add", (req, res) => {
  const Parentaldata = new Parental({
    parental: req.body.parental,
  });

  Parentaldata.save()
    .then((err, user) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => console.log(err));
});

router.post("/editParental/:id", (req, res, next) => {
  let Parentals = {};

  Parentals.parental = req.body.parental;

  let query = {
    _id: req.params.id,
  };

  Parental.updateOne(query, Parentals, (err, parental) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(parental);
    }
  });
});

router.post("/deleteParental/:id", (req, res) => {
  Parental.remove(
    {
      _id: req.params.id,
    },
    (err, user) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(user);
      }
    }
  );
});

router.get("/admin-creatorprofile/:id", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Creator.findById(req.params.id, (err, creator) => {
      if (err) {
        console.log(err);
      }

      res.render("admin-creatorprofile", {
        creator: creator,
        company: company,
      });
    });
  });
});

router.get("/admin-creator", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Creator.find((err, creator) => {
      if (err) {
        console.log(err);
      }

      res.render("admin-creator", {
        creator: creator,
        company: company,
      });
    });
  });
});

router.get("/admin-creatorvideos/:id", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Video.find(
      {
        user: req.params.id,
      },
      (err, videos) => {
        if (err) {
          console.log(err);
        }

        res.render("admin-creatorvideos", {
          videos: videos,
          company: company,
        });
      }
    );
  });
});

router.get("/All-videos", (req, res) => {
  if (!req.user) {
    return res.redirect("/adminauth/login");
  } else {
    console.log(req.user._id);
  }
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Currency.find((err, currency) => {
      if (err) {
        console.log(err);
      }

      Video.find((err, videos) => {
        if (err) {
          console.log(err);
        }

        res.render("allvideos", {
          videos: videos,
          company: company,
          currency: currency,
        });
      });
    });
  });
});

let uploads = {};

router.get("/addvideo", (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Category.find((err, category) => {
      if (err) {
        console.log(err);
      }

      Payment.find((err, pay) => {
        if (err) {
          console.log(err);
        }

        Language.find((err, language) => {
          if (err) {
            console.log(err);
          }

          Genre.find((err, genre) => {
            if (err) {
              console.log(err);
            }
            Age.find((err, age) => {
              if (err) {
                console.log(err);
              }
              Parental.find((err, parental) => {
                if (err) {
                  console.log(err);
                }

                Currency.find((err, currency) => {
                  if (err) {
                    console.log(err);
                  }

                  console.log(currency);

                  res.render("addvideobyadmin", {
                    pay: pay,
                    currency: currency,
                    company: company,
                    age: age,
                    parental: parental,
                    genre: genre,
                    language: language,
                    category: category,
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

/////////////////////////////////////////////////////////////////////
///// FUNCTION TO UPLOAD VIDEOS AND IMAGES IN DISK USING MULTER /////
/////////////////////////////////////////////////////////////////////

// var upload = multer({
//   storage: multer.diskStorage({

//     destination: './public/upload/',

//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
//     }

//   }),

//   fileFilter: function (req, file, callback) {
//     var ext = path.extname(file.originalname)
//     if (ext !== '.mp4' && ext !== '.png' && ext !== '.jpg') {
//         return callback(('Only videos are allowed'), null, false)
//       }
//     callback(null, true)
//   }
// });

////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
///// FUNCTION TO UPLOAD VIDEOS AND IMAGES IN DO SPACES /////
//////////////////////////////////////////////////////////
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const spacesEndpoint = new aws.Endpoint("sfo3.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "GBUROGE4SCMAITJOT3PG",
  secretAccessKey: "Bmm04m60gZpuIfj5oViJJS2oBvsnpBXyWTuEvqm/ABo",
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "shott",
    acl: "public-read",
    key: function (request, file, cb) {
      file.filename =
        file.fieldname + "-" + Date.now() + "-" + file.originalname;
      console.log(file);
      cb(null, file.filename);
    },
  }),
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post("/addvideos", upload.any(), (req, res) => {
  if (!req.user._id) {
    return res.redirect("/adminauth/login");
  } else {
    console.log(req.user._id);
  }

  const challengedata = new Video({
    user: req.user._id,
    title: req.body.title,
    plot: req.body.plot,
    thumbnail: `${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`,
    bannerimage: `${
      req.files[1] && req.files[1].filename ? req.files[1].filename : ""
    }`,
    video: `${
      req.files[2] && req.files[2].filename ? req.files[2].filename : ""
    }`,
    ipaddress: ip.address(),
    price: req.body.price,
    language: req.body.language,
    genre: req.body.genre,
    Age: req.body.Age,
    parentalguidance: req.body.parentalguidance,
    crewimage: `${
      req.files[3] && req.files[3].filename ? req.files[3].filename : ""
    }`,
    crewname: req.body.crewname,
    crewrole: req.body.crewrole,
    time: moment().format("LT"),
    category: req.body.category,
  });

  challengedata.save().then((stud) => {
    req.flash("success_msg", "Challenge is added");

    console.log(stud);

    res.redirect("/admin/dashboard");
  });
});

router.get("/deletevideo/:id", ensureAuthenticated, (req, res) => {
  Video.remove(
    {
      _id: req.params.id,
    },
    (err) => {
      if (!err) {
        res.redirect("/admin/All-videos");
      } else {
        errors.push({
          msg: "failed",
        });
      }
    }
  );
});

// router.post('/addvideos',  uploadimg.any(), (req, res) => {

//   try {
//     let fileId = req.headers["x-file-id"];
//     let startByte = parseInt(req.headers["x-start-byte"], 10);
//     let name = req.headers["name"];
//     let fileSize = parseInt(req.headers["size"], 10);
//     console.log("file Size", fileSize, fileId, startByte);
//     if (uploads[fileId] && fileSize == uploads[fileId].bytesReceived) {
//       res.end();
//       return;
//     }

//     console.log(fileSize);

//     if (!fileId) {
//       res.writeHead(400, "No file id");
//       res.end(400);
//     }
//     console.log(uploads[fileId]);
//     if (!uploads[fileId]) uploads[fileId] = {};

//     let upload = uploads[fileId];

//     let fileStream;

//     if (!startByte) {
//       upload.bytesReceived = 0;
//       let name = req.headers["name"];
//       fileStream = fs.createWriteStream(`./name/${name}`, {
//         flags: "w",
//       });
//     } else {
//       if (upload.bytesReceived != startByte) {
//         res.writeHead(400, "Wrong start byte");
//         res.end(upload.bytesReceived);
//         return;
//       }
//       // append to existing file
//       fileStream = fs.createWriteStream(`./name/${name}`, {
//         flags: "a",
//       });
//     }

//     req.on("data", function (data) {
//       //console.log("bytes received", upload.bytesReceived);
//       upload.bytesReceived += data.length;
//     });

//     req.pipe(fileStream);

//     // when the request is finished, and all its data is written
//     fileStream.on("close", function () {
//       console.log(upload.bytesReceived, fileSize);
//       if (upload.bytesReceived == fileSize) {
//         console.log("Upload finished");
//         delete uploads[fileId];

//         // can do something else with the uploaded file here
//         res.send({ status: "uploaded" });
//         res.end();
//       } else {
//         // connection lost, we leave the unfinished file around
//         console.log("File unfinished, stopped at " + upload.bytesReceived);
//         res.writeHead(500, "Server Error");
//         res.end();
//       }
//     });

//   const challengedata = new Video({
//     title: req.body.title,
//     plot: req.body.plot,
//     thumbnail: `https://admin.shott.tech/upload/${req.files[0] && req.files[0].filename ? req.files[0].filename : ''}`,
//     bannerimage: `https://admin.shott.tech/upload/${req.files[1] && req.files[1].filename ? req.files[1].filename : ''}`,
//     video: file,
//     ipaddress: ip.address(),
//     price: req.body.price,
//     language: req.body.language,
//     genre: req.body.genre,
//     Age: req.body.Age,
//     parentalguidance: req.body.parentalguidance,
//     category: req.body.category,
//     crewimage: `https://admin.shott.tech/upload/${req.files[3] && req.files[3].filename ? req.files[3].filename : ''}`,
//     crewname: req.body.crewname,
//     crewrole: req.body.crewrole,
//     time: moment().format("LT")

//   })

//   challengedata.save().then(stud => {

//     req.flash(
//       'success_msg',
//       'Challenge is added'
//     );

//     console.log(stud)

//     res.redirect('/admin/All-videos');

//   })

//     // in case of I/O error - finish the request
//     fileStream.on("error", function (err) {
//       console.log("fileStream error", err);
//       res.writeHead(500, "File error");
//       res.end();
//     });
//   } catch (err) {
//     console.log(err);
//   }

// })

router.get("/Categories", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Category.find((err, category) => {
      if (err) {
        console.log(err);
      }

      res.render("Categories", {
        user: req.user,
        category: category,
        company: company,
        axios: axios,
      });
    });
  });
});
router.get("/Add-category", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    res.render("Add-category", {
      user: req.user,
      company: company,
    });
  });
});

router.post("/Add-category", ensureAuthenticated, (req, res) => {
  const categorydata = new Category({
    category: req.body.category,
  });

  Category.findOne({
    category: req.body.category,
  }).then((user) => {
    if (user) {
      res.send({
        Error: "This category is already exist",
      });
    } else {
      categorydata
        .save()
        .then((user) => {
          req.flash("success_msg", "Added");
          res.redirect("/admin/Categories");
        })
        .catch((err) => console.log(err));
    }
  });
});

router.post("/editcategory/:id", ensureAuthenticated, (req, res, next) => {
  let categorys = {};

  categorys.category = req.body.category;

  let query = {
    _id: req.params.id,
  };

  Category.findOne({
    category: req.body.category,
  }).then((user) => {
    if (user) {
      res.send({
        Error: "This category is already exist",
      });
    } else {
      Category.update(query, categorys, (err) => {
        if (!err) {
          req.flash("success_msg", "grade is added");
          res.redirect("/admin/Categories");
        } else {
          errors.push({
            msg: "failed",
          });
        }
      });
    }
  });
});

router.get("/editcategory/:id", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Category.findById(req.params.id, (err, category) => {
      if (err) {
        console.log(err);
      }

      res.render("editcategory", {
        user: req.user,
        category: category,
        company: company,
      });
    });
  });
});

router.get("/deletecategory/:id", ensureAuthenticated, (req, res) => {
  Category.remove(
    {
      _id: req.params.id,
    },
    (err) => {
      if (!err) {
        res.redirect("/admin/Categories");
      } else {
        errors.push({
          msg: "failed",
        });
      }
    }
  );
});

router.get("/companydata", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    res.render("companydata", {
      user: req.user,
      company: company,
    });
  });
});

var upload = multer({
  storage: multer.diskStorage({
    destination: "./public/upload/",

    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".mkv" && ext !== ".png" && ext !== ".jpg") {
      return callback("Only videos are allowed", null, false);
    }
    callback(null, true);
  },
});

router.post(
  "/addcompanydata/:id",
  ensureAuthenticated,
  upload.any(),
  (req, res) => {
    const query = {
      _id: req.params.id,
    };

    const companydata = {};
    (companydata.logo = `https://api.shott.tech/upload/${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`),
      (companydata.companyname = req.body.companyname),
      (companydata.address = req.body.address),
      (companydata.city = req.body.city),
      (companydata.state = req.body.state),
      (companydata.country = req.body.country),
      (companydata.pincode = req.body.pincode),
      (companydata.contactpersonname = req.body.contactpersonname),
      (companydata.mobile = req.body.mobile),
      (companydata.email = req.body.email),
      (companydata.facebookpageURL = req.body.facebookpageURL),
      (companydata.twitter = req.body.twitter),
      (companydata.gstnumber = req.body.gstnumber),
      (companydata.androidappstoreURL = req.body.androidappstoreURL),
      (companydata.iOSAppStoreURL = req.body.iOSAppStoreURL),
      (companydata.MobileAppPagetext = req.body.MobileAppPagetext),
      (companydata.CopyrightMessage = req.body.CopyrightMessage),
      (companydata.linkedin = req.body.linkedin),
      (companydata.insta = req.body.insta),
      Company.update(query, companydata, (err, company) => {
        req.flash("success_msg", "company data is added");

        console.log(company);

        res.redirect("/admin/companydata");
      });
  }
);

router.get("/payment", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Payment.find((err, pay) => {
      if (err) {
        console.log(err);
      }

      Currency.find((err, currency) => {
        if (err) {
          console.log(err);
        }

        res.render("payment", {
          user: req.user,
          pay: pay,
          currency: currency,
          company: company,
        });
      });
    });
  });
});

router.post("/paymentoption/:id", ensureAuthenticated, (req, res) => {
  const paymentdata = {};

  paymentdata.one_monthprice = req.body.one_monthprice;
  paymentdata.three_monthprice = req.body.three_monthprice;
  paymentdata.six_monthprice = req.body.six_monthprice;
  paymentdata.one_yearprice = req.body.one_yearprice;

  console.log(paymentdata);

  const query = {
    _id: req.params.id,
  };

  Payment.updateOne(query, paymentdata, (err, pay) => {
    req.flash("success_msg", "payment data is added");

    console.log(pay);

    res.redirect("/admin/payment");
  });
});

router.post("/subscriptionoption", ensureAuthenticated, (req, res) => {
  const subscribedata = new Subscription({
    name: req.body.name,
    price: req.body.price,
    duration: req.body.duration,
  });

  subscribedata.save(function (err, vid) {
    if (err) {
      res.send({
        Success: "Error",
      });
    }
    console.log(vid.status);
  });

  res.redirect("/admin/payment");
});

router.post("/currency/:id", ensureAuthenticated, (req, res) => {
  const currencydata = {};

  currencydata.currency = req.body.currency;

  const query = {
    _id: req.params.id,
  };

  Currency.update(query, currencydata, (err, pay) => {
    req.flash("success_msg", "currency data is added");

    console.log(pay);

    res.redirect("/admin/payment");
  });
});

router.get("/editvideo/:id", async (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Video.findById(req.params.id, (err, video) => {
      if (err) {
        console.log(err);
      }

      Category.find((err, category) => {
        if (err) {
          console.log(err);
        }

        Payment.find((err, pay) => {
          if (err) {
            console.log(err);
          }

          Language.find((err, language) => {
            if (err) {
              console.log(err);
            }

            Genre.find((err, genre) => {
              if (err) {
                console.log(err);
              }
              Age.find((err, age) => {
                if (err) {
                  console.log(err);
                }
                Parental.find((err, parental) => {
                  if (err) {
                    console.log(err);
                  }

                  Currency.find((err, currency) => {
                    if (err) {
                      console.log(err);
                    }

                    console.log(currency);

                    res.render("editvideo", {
                      pay: pay,
                      currency: currency,
                      video: video,
                      company: company,
                      category: category,
                      age: age,
                      parental: parental,
                      genre: genre,
                      language: language,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
var upload = multer({
  storage: multer.diskStorage({
    destination: "./public/upload/",

    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".png" && ext !== ".jpg") {
      return callback("Only videos are allowed", null, false);
    }
    callback(null, true);
  },
});

router.post("/editvideo/:id", ensureAuthenticated, upload.any(), (req, res) => {
  const query = {
    _id: req.params.id,
  };

  const videodata = {};

  (videodata.user = req.user._id),
    (videodata.title = req.body.title),
    (videodata.plot = req.body.plot),
    (videodata.thumbnail = `https://api.shott.tech/upload/upload/${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`),
    (videodata.bannerimage = `https://api.shott.tech/upload/upload/${
      req.files[1] && req.files[1].filename ? req.files[1].filename : ""
    }`),
    (videodata.video = `https://api.shott.tech/upload/upload/${
      req.files[2] && req.files[2].filename ? req.files[2].filename : ""
    }`),
    (ipaddress = ip.address()),
    (videodata.price = req.body.price),
    (videodata.language = req.body.language),
    (videodata.genre = req.body.genre),
    (videodata.Age = req.body.Age),
    (videodata.parentalguidance = req.body.parentalguidance),
    (videodata.category = req.body.category),
    (videodata.crewimage = `https://api.shott.tech/upload/${
      req.files[3] && req.files[3].filename ? req.files[3].filename : ""
    }`),
    (videodata.crewname = req.body.crewname),
    (videodata.crewrole = req.body.crewrole),
    (videodata.time = moment().format("LT"));

  Video.update(query, videodata).then((stud) => {
    req.flash("success_msg", "Challenge is added");

    console.log(stud);

    res.redirect("/admin/All-videos");
  });
});

router.get("/Videodetails/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body);

  Video.findById(req.params.id, (err, video) => {
    if (err) {
      console.log(err);
    }

    Company.find((err, company) => {
      if (err) {
        console.log(err);
      }

      Currency.find((err, currency) => {
        if (err) {
          console.log(err);
        }

        res.render("videodetail", {
          user: req.user,
          video: video,
          company: company,
          currency: currency,
        });
      });
    });
  });
});

router.get("/suspendvideo/:id", ensureAuthenticated, (req, res) => {
  Video.findById(req.params.id, (err, video) => {
    console.log(video);
    console.log(video.status);
    video.status = false;

    video.save(function (err, vid) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin/All-videos");
      }
    });
  });
});

router.get("/makelivevideo/:id", ensureAuthenticated, (req, res) => {
  Video.findById(req.params.id, (err, video) => {
    video.status = true;

    video.save(function (err, vid) {
      if (err) {
        res.send({
          Success: "Error",
        });
      }
      console.log(vid.status);
    });

    res.redirect("/admin/All-videos");
  });
});

router.get("/addcompanydata", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }
    res.render("addcompanydata", { company: company });
  });
});

router.get("/viewuser", ensureAuthenticated, (req, res) => {
  Auth.find((err, user) => {
    if (err) {
      console.log(err);
    }

    Company.find((err, company) => {
      if (err) {
        console.log(err);
      }

      res.render("viewuser", { user: user, company: company, moment: moment });
    });
  });
});

router.get("/watchhistory/:id", ensureAuthenticated, (req, res) => {
  Watchhistory.find({ viewby: req.params.id }, (err, fav) => {
    if (err) {
      console.log(err);
    } else if (!fav || fav.length === 0) {
      Company.find((err, company) => {
        if (err) {
          console.log(err);
        }

        res.render("userwatchistory", {
          company: company,
          video: fav,
        });
      });
    } else {
      Video.find(
        {
          _id: {
            $in: fav[0].video,
          },
        },
        (err, video) => {
          if (err) {
            console.log(err);
          }

          Company.find((err, company) => {
            if (err) {
              console.log(err);
            }

            res.render("userwatchistory", {
              user: req.user,
              video: video,
              company: company,
            });
          });
        }
      );
    }
  });
});

var uploadimg = multer({
  storage: multer.diskStorage({
    destination: "./public/upload/",

    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mp4" && ext !== ".png" && ext !== ".jpg") {
      return callback("Only videos are allowed", null, false);
    }
    callback(null, true);
  },
});

router.get("/banner", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Banner.find((err, banner) => {
      if (err) {
        console.log(err);
      }

      Category.find((err, category) => {
        if (err) {
          console.log(err);
        }

        res.render("banner", {
          user: req.user,
          company: company,
          banner: banner,
          moment: moment().format("LT"),
          moment2: moment,
          category: category,
        });
      });
    });
  });
});

router.post("/Addbanner", ensureAuthenticated, uploadimg.any(), (req, res) => {
  const bannerdata = new Banner({
    title: req.body.title,
    bannerimage: `https://api.shott.tech/upload/${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`,
    category: req.body.category,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    link: req.body.link,
  });

  bannerdata.save(function (err, vid) {
    if (err) {
      res.json(200)(err);
    } else {
      res.redirect("/admin/banner");
    }
  });
});

router.get("/Addbanner", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Category.find((err, category) => {
      if (err) {
        console.log(err);
      }

      Video.find((err, video) => {
        if (err) {
          console.log(err);
        }

        res.render("addbanner", {
          user: req.user,
          company: company,
          category: category,
          video: video,
        });
      });
    });
  });
});

router.post(
  "/editbanner/:id",
  ensureAuthenticated,
  upload.any(),
  (req, res, next) => {
    let bannerdata = {};

    bannerdata.title = req.body.title;
    (bannerdata.bannerimage = `https://api.shott.tech/upload/upload/${
      req.files[0] && req.files[0].filename ? req.files[0].filename : ""
    }`),
      (category = req.body.category),
      (bannerdata.startdate = req.body.startdate);
    bannerdata.enddate = req.body.enddate;
    bannerdata.link = req.body.link;

    let query = {
      _id: req.params.id,
    };

    Banner.update(query, bannerdata, (err) => {
      if (!err) {
        req.flash("success_msg", "grade is added");
        res.redirect("/admin/banner");
      } else {
        errors.push({
          msg: "failed",
        });
      }
    });
  }
);

router.get("/editbanner/:id", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Category.find((err, category) => {
      if (err) {
        console.log(err);
      }

      Banner.findById(req.params.id, (err, banner) => {
        if (err) {
          console.log(err);
        }

        res.render("editbanner", {
          user: req.user,
          banner: banner,
          company: company,
          category: category,
        });
      });
    });
  });
});

router.get("/bannerdetails/:id", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    Banner.findById(req.params.id, (err, banner) => {
      if (err) {
        console.log(err);
      }

      res.render("bannerdetails", {
        user: req.user,
        banner: banner,
        company: company,
        moment: moment().format("LT"),
        moment2: moment,
      });
    });
  });
});

router.get("/suspendbanner/:id", ensureAuthenticated, (req, res) => {
  Banner.findById(req.params.id, (err, banner) => {
    console.log(banner);
    console.log(banner.status);
    banner.status = false;

    banner.save(function (err, vid) {
      if (err) {
        res.send({
          Success: "Error",
        });
      }
      console.log(vid.status);
    });

    res.redirect("/admin/banner");
  });
});

router.get("/makelivebanner/:id", ensureAuthenticated, (req, res) => {
  Banner.findById(req.params.id, (err, banner) => {
    banner.status = true;

    banner.save(function (err, vid) {
      if (err) {
        res.send({
          Success: "Error",
        });
      }
      console.log(vid.status);
    });

    res.redirect("/admin/banner");
  });
});

router.get("/suspenduser/:id", ensureAuthenticated, (req, res) => {
  Auth.findById(req.params.id, (err, auth) => {
    auth.status = false;

    auth.save(function (err, user) {
      if (err) {
        console.log(err);
      }
    });

    res.redirect("/admin/viewuser");
  });
});

router.get("/makeliveuser/:id", ensureAuthenticated, (req, res) => {
  Auth.findById(req.params.id, (err, auth) => {
    auth.status = true;

    auth.save(function (err, aut) {
      if (err) {
        res.send({
          Success: "Error",
        });
      }
    });

    res.redirect("/admin/viewuser");
  });
});

router.get("/reports", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    res.render("reports", {
      user: req.user,
      company: company,
    });
  });
});

router.get("/staff", ensureAuthenticated, (req, res) => {
  Company.find((err, company) => {
    if (err) {
      console.log(err);
    }

    res.render("staff", {
      user: req.user,
      company: company,
    });
  });
});

module.exports = router;
