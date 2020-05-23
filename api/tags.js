const express = require("express");
const tagsRouter = express.Router();

const { getPostsByTagName } = require("../db");

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const postFromTag = await getPostsByTagName(tagName);
    res.send({ post: postFromTag });
  } catch ({ name, message }) {
    ({ name, message });
  }
});

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags: [],
  });
});

module.exports = tagsRouter;
