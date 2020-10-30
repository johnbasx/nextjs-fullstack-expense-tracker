const Category = require("../models/category");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const { errorHandler } = require("./dbErrorHandler");

// creating category
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded!",
      });
    }
    // check for all fields
    const { name } = fields;

    if (!name) {
      return res.status(400).json({
        error: "Enter Category Name",
      });
    }

    let category = new Category(fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2mb in size",
        });
      }
      category.photo.data = fs.readFileSync(files.photo.path);
      category.photo.contentType = files.photo.type;
    }

    category.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(200).json(result);
    });
  });
};

//read category by id
exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category Not Found!",
      });
    }
    req.category = category;
    next();
  });
};

//read category photo
exports.read = (req, res) => {
  req.category.photo = undefined;
  return res.json(req.category);
};

//remove category
exports.remove = (req, res) => {
  const category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Category deleted",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let category = req.category;
    category = _.extend(category, fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: "Image should be less than 2mb in size",
        });
      }
      category.photo.data = fs.readFileSync(files.photo.path);
      category.photo.contentType = files.photo.type;
    }

    category.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

//listing all the categories as per order,sortBy and limit=6
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Category.find()
    .select("-photo")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          error: "Categories not found",
        });
      }
      res.json(categories);
    });
};

//listing all the categories as per order,sortBy and no limit
exports.listAll = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  // let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Category.find()
    .select("-photo")
    .sort([[sortBy, order]])
    // .limit(limit)
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          error: "Categories not found",
        });
      }
      res.json(categories);
    });
};

//for photo
exports.photo = (req, res, next) => {
  if (req.category.photo.data) {
    res.set("Content-Type", req.category.photo.contentType);
    return res.send(req.category.photo.data);
  }
  next();
};
