const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Category = require("../models/Category");
const ContactMessage = require("../models/ContactMessage");

// GET /admin/dashboard - Admin dashboard
exports.dashboard = async (req, res) => {
  try {
    // Set cache-control headers to prevent caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const category = req.query.category;
    const query = {
      isDeleted: { $ne: true },
      type: "exercise", // Only show exercises
    };

    if (category) {
      query.category = category;
    }

    const totalPosts = await BlogPost.countDocuments({
      isDeleted: { $ne: true },
    });
    const totalUsers = await User.countDocuments();
    const categories = await Category.find().sort({ name: 1 });

    // Filter to show only exercises (not solutions), sorted alphabetically by title
    const recentPosts = await BlogPost.find(query)
      .populate("author", "username")
      .populate("solutionId") // Populate full solution object to get its _id
      .sort({ title: 1 }) // Tri alphabétique par titre
      .limit(10);

    res.render("admin/dashboard", {
      totalPosts,
      totalUsers,
      recentPosts,
      categories,
      category: category || null,
      success: req.query.success || null,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Error loading dashboard");
  }
};

// GET /admin/posts - Manage all posts
exports.managePosts = async (req, res) => {
  try {
    // Set cache-control headers to prevent caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    const category = req.query.category;
    const query = { type: "exercise" };

    if (category) {
      query.category = category;
    }

    const categories = await Category.find().sort({ name: 1 });

    // Filter to show only exercises (not solutions), sorted alphabetically by title
    const posts = await BlogPost.find(query)
      .populate("author", "username")
      .populate("solutionId") // Populate full solution object to get its _id
      .sort({ title: 1 }); // Tri alphabétique par titre

    res.render("admin/posts", {
      posts,
      categories,
      category: category || null,
      success: req.query.success,
      error: req.query.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manage posts error:", error);
    res.status(500).send("Error loading posts");
  }
};

// GET /admin/posts/:id/edit - Edit post form
exports.editPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate(
      "author",
      "username",
    );
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const categories = await Category.find().sort({ name: 1 });
    res.render("admin/edit-post", { post, categories });
  } catch (error) {
    console.error("Edit post error:", error);
    res.status(500).send("Error loading post");
  }
};

// POST /admin/posts/:id/update - Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const updateData = {
      title,
      body,
      category: category || "Arithmétique",
      updatedAt: new Date(),
    };

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.redirect("/admin/posts?success=Post updated successfully");
  } catch (error) {
    console.error("Update post error:", error);
    res.redirect("/admin/posts?error=Error updating post");
  }
};

// DELETE /admin/posts/:id - Soft delete post
exports.deletePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.redirect("/admin/posts?success=Post deleted successfully");
  } catch (error) {
    console.error("Delete post error:", error);
    res.redirect("/admin/posts?error=Error deleting post");
  }
};

// POST /admin/posts/:id/restore - Restore deleted post
exports.restorePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      deletedAt: null,
    });

    res.redirect("/admin/posts?success=Post restored successfully");
  } catch (error) {
    console.error("Restore post error:", error);
    res.redirect("/admin/posts?error=Error restoring post");
  }
};

// POST /admin/posts/:id/delete-permanently - Permanently delete post
exports.deletePermanently = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.redirect("/admin/posts?error=Post not found");
    }

    // Only allow permanent deletion of already soft-deleted posts
    if (!post.isDeleted) {
      return res.redirect("/admin/posts?error=Post must be soft-deleted first");
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.redirect("/admin/posts?success=Post permanently deleted");
  } catch (error) {
    console.error("Permanent delete error:", error);
    res.redirect("/admin/posts?error=Error permanently deleting post");
  }
};

// GET /admin/users - Manage all users
exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render("admin/users", {
      users,
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Manage users error:", error);
    res.status(500).send("Error loading users");
  }
};

// GET /admin/contact-messages - View contact form submissions
exports.viewContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.render("admin/contact-messages", { messages });
  } catch (error) {
    console.error("View contact messages error:", error);
    res.status(500).send("Error loading contact messages");
  }
};
