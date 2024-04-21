// API respond
import express from "express";
import bodyParser from "body-parser";
// import readline from "readline";


const app = express();
const port = 3000;

// Data store
let posts = [{
    id: 1,
    title: "The Power of Minimalism: Simplifying Your Life",
    content: "This blog post explores the benefits of embracing minimalism and decluttering one's life. It discusses how simplifying possessions, commitments, and thoughts can lead to greater clarity, focus, and overall well-being.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
},
{
    id: 2,
    title: "The Art of Productivity: How to Get More Done in Less Time",
    content: "In this post, the author shares practical tips and strategies for improving productivity. From time management techniques to prioritization methods, readers will learn how to maximize their efficiency and accomplish their goals more effectively.",
    author: "Alex Smith",
    date: "April 2, 2024",
},
{
    id: 3,
    title: "Finding Balance: Navigating Work and Life",
    content: "This blog post delves into the importance of achieving a healthy balance between work and personal life. It discusses the challenges many people face in juggling career demands with family, hobbies, and self-care, offering insights and suggestions for creating harmony.",
    author: "Emily Chang",
    date: "February 28, 2024",
},]

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Setting up response to requests

// Get all posts

app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// GET a specific post by id

app.get("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const getPost = posts.find((post) => post.id === id);
    if (!getPost) return res.status(404).json({ message: "Post not found" });
    res.json(getPost);
});

// Create a post
app.post("/api/posts", (req, res) => {
    const currentDate=new Date();
    const dateWithoutTime ={
       month: currentDate.toLocaleString('en-US',{ month: "long" }),
       day:currentDate.getDate(),
       year:currentDate.getFullYear(),
    } 
    const dateFormat= (`${dateWithoutTime.month} ${dateWithoutTime.day}, ${dateWithoutTime.year}`);

    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: dateFormat,
    }
    const lastId = posts.length+1;
    posts.push(newPost);
    res.status(201).json(newPost);
    

});

// Patch a post for updating only one parameter

app.patch("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.body.title) {
        post.title = req.body.title;
    }
    if (req.body.content) {
        post.content = req.body.content;
    }
    if (req.body.author) {
        post.author = req.body.author;
    }

    res.json(post);
});

// Delete post
app.delete("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
   
    if (index > -1) {
        posts.splice(index, 1);
        res.json({ message: "Post Deleted" });
    
    //  This is the command line code 

    //     const rl = readline.createInterface({
    //         input: process.stdin,
    //         output: process.stdout
    //     });
    //  rl.question("Are you sure you want to delete this post? Type 'yes' to confirm: ", (confirmation)=>{
    //     if (confirmation.trim().toLowerCase() === "yes"){
    //         posts.splice(index, 1);
    //         res.json({ message: "Post Deleted" });
    //     } else {
    //         res.json({ message: "Deletion cancelled" });
    //     }
    //     rl.close();
    // });

    } else {
        res.status(404).json({ message: "Post not found" });
    }

    // res.json({ message: "Post Deleted" });
});


app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});

