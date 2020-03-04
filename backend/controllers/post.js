const Post = require("../models/post");
exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post
    .save()
    .then(post => {
      res.status(201).json({
        message: "post successfully created",
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creator: post.creator
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "can not add post."
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const pageNumber = +req.query.page;
  const query = Post.find();
  let fetchedPosts;
  if (pageSize && pageNumber) {
    query.skip(pageSize * (pageNumber - 1)).limit(pageSize);
  }
  query
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "successfully returned posts",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "can not fetch posts."
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(document => {
      res.status(200).json({
        message: "successfully returned posts",
        post: document
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "can not get by id."
      });
    });
};
exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Succefully updated post" });
        } else {
          res.status(401).json({ message: "Not Authorized" });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "can not update."
        });
      });
  };
  exports.deletePost = (req, res, next) => {
    Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    })
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: "Succefully deleted post" });
        } else {
          res.status(401).json({ message: "Not Authorized" });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "can not delete."
        });
      });
  };