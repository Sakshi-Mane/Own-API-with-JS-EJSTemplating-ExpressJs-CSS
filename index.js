import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 4000;
const url = "http://localhost:3000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${url}/api/posts`);
    const allPosts = response.data;
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    // console.log(response);
    const recentPosts = allPosts.slice(0, 4);
    res.render("index.ejs", { posts: recentPosts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("edit.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${url}/api/posts/${req.params.id}`);
    // console.log(response.data);
    res.render("edit.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/posts", async (req, res) => {
  try {
    const response = await axios.post(`${url}/api/posts`, req.body);
    // console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Update a post
app.post("/posts/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${url}/api/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${url}/api/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Frontend server is running on http://localhost:${port}`);
});