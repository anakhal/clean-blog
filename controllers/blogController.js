const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Category = require("../models/Category");

exports.index = async (req, res) => {
  try {
    // 1. Fetch all categories and build hierarchy
    const allCategories = await Category.find().sort({ name: 1 }).lean();

    // Group into hierarchy: Parent -> Children
    const hierarchy = [];
    const parents = allCategories.filter(c => !c.parent);
    const children = allCategories.filter(c => c.parent);

    parents.forEach(p => {
      // Attach children array to parent object
      p.children = children.filter(c => c.parent && c.parent.toString() === p._id.toString());
      hierarchy.push(p);
    });

    // 2. Handle Default Category Redirect
    // If no category is selected, redirect to the first parent (e.g., Algèbre)
    let categoryName = req.query.category;
    if (!categoryName) {
      if (hierarchy.length > 0) {
        return res.redirect(`/?category=${encodeURIComponent(hierarchy[0].name)}`);
      }
    }

    // 3. Determine Query based on selection
    const query = {
      isDeleted: { $ne: true },
      type: "exercise",
    };

    let selectedCategory = null;

    if (categoryName) {
      // Find the selected category object
      selectedCategory = allCategories.find(c => c.name === categoryName);

      if (selectedCategory) {
        // Check if it's a parent category (has no parent itself, or is in our parents list)
        const isParent = !selectedCategory.parent;

        if (isParent) {
          // It's a parent: fetch posts for this parent AND all its children
          const childIds = allCategories
            .filter(c => c.parent && c.parent.toString() === selectedCategory._id.toString())
            .map(c => c._id);

          // Query: category IN [this_parent_id, ...all_child_ids]
          query.category = { $in: [selectedCategory._id, ...childIds] };
        } else {
          // It's a child: fetch posts for just this category
          query.category = selectedCategory._id;
        }
      } else {
        // Category name in URL doesn't exist in DB
        query.category = null; // Will result in 0 posts
      }
    }

    const posts = await BlogPost.find(query)
      .populate("author", "username")
      .populate("category")
      .sort({ createdAt: 1 });

    // SEO metadata
    const seo = {
      title: categoryName
        ? `${categoryName} - Exercices Corrigés Bac Marocain | Mathématiques-Bac.org`
        : "Mathématiques Bac Marocain",
      description: categoryName
        ? `Exercices corrigés de ${categoryName}. Solutions détaillées.`
        : "Exercices corrigés de mathématiques.",
      keywords: categoryName
        ? `${categoryName.toLowerCase()}, bac maroc, exercices`
        : "mathématiques, bac maroc",
      canonical: categoryName
        ? `https://www.mathematiques-bac.org/?category=${encodeURIComponent(categoryName)}`
        : "https://www.mathematiques-bac.org/",
      ogImage: "https://www.mathematiques-bac.org/assets/img/home-bg.jpg",
    };

    const hasEnoughContent = posts.length >= 3;

    // Pass hierarchy and allCategories to view
    res.render("index", {
      posts,
      categories: allCategories,
      hierarchy, // New hierarchical structure
      category: categoryName || null,
      seo,
      showAds: hasEnoughContent
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.create = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const exerciseId = req.query.exerciseId;

    let exercise = null;
    if (exerciseId) {
      exercise = await BlogPost.findById(exerciseId);
    }

    res.render("create", {
      categories,
      exerciseId: exerciseId || undefined,
      exercise: exercise || null,
      showAds: false,
      noindex: true,
    });
  } catch (err) {
    console.error(err);
    res.render("create", {
      categories: [],
      exerciseId: undefined,
      exercise: null,
      showAds: false,
      noindex: true,
    });
  }
};

// Posting the populated form
exports.store = async (req, res) => {
  try {
    if (!req.session.userId) {
      console.error("No userId in session. Cannot create post.");
      return res.status(401).send("Unauthorized: Please log in as admin.");
    }

    console.log("DEBUG - Starting post creation...");
    console.log("DEBUG - req.session.userId:", req.session.userId);
    console.log("DEBUG - req.body:", req.body);

    const exerciseId = req.body.exerciseId;
    const type = req.body.type || "exercise";

    const blogpost = new BlogPost({
      title: req.body.title,
      body: req.body.body,
      author: req.session.userId,
      category: req.body.category || (await Category.findOne({ name: "Arithmétique" }))._id,
      type: type,
      exerciseId: exerciseId || null,
    });

    console.log("DEBUG - BlogPost object created:", {
      title: blogpost.title,
      type: blogpost.type,
      author: blogpost.author,
      category: blogpost.category,
    });

    const savedPost = await blogpost.save();
    console.log("DEBUG - Post saved successfully! ID:", savedPost._id);

    // If this is a solution, update the exercise with the solutionId
    if (exerciseId && type === "solution") {
      await BlogPost.findByIdAndUpdate(exerciseId, {
        solutionId: savedPost._id,
      });
      console.log("DEBUG - Linked solution to exercise:", exerciseId);
    }

    console.log("DEBUG - Redirecting to home page...");
    res.redirect("/");
  } catch (error) {
    console.error("ERROR - Error Posting a blogpost:", error);
    console.error("ERROR - Stack trace:", error.stack);
    res.status(500).send("Error Posting a blogpost: " + error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    })
      .populate("author", "username")
      .populate("category")
      .populate("solutionId", "title")
      .populate("exerciseId", "title");

    if (!post) {
      return res.status(404).send("Post not Found");
    }

    // SEO metadata for individual post
    const cleanTitle = post.title.substring(0, 60);
    const cleanBody = post.body.replace(/<[^>]*>/g, "").substring(0, 155);

    const seo = {
      title: `${cleanTitle} - Exercice Corrigé Bac Marocain | Mathématiques`,
      description: `${cleanBody}... Solution détaillée pour ${post.category?.name || "mathématiques"} - Bac Marocain`,
      keywords: `${post.category?.name?.toLowerCase() || "mathématiques"}, exercice corrigé, bac maroc, ${cleanTitle.toLowerCase()}, solution mathématiques`,
      canonical: `https://www.mathematiques-bac.org/post/${post._id}`,
      ogImage: "https://www.mathematiques-bac.org/assets/img/post-bg.jpg",
    };

    // Only show ads if post has sufficient content (300+ characters of actual text)
    // Strip HTML and check content length to comply with AdSense policy
    const textContent = post.body.replace(/<[^>]*>/g, '').trim();
    const hasEnoughContent = textContent.length >= 300;
    res.render("post", { post, seo, showAds: hasEnoughContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// search
exports.search = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    let posts = [];

    if (searchQuery) {
      posts = await BlogPost.find({
        $and: [
          { isDeleted: { $ne: true } },
          {
            $or: [
              { title: { $regex: searchQuery, $options: "i" } },
              { body: { $regex: searchQuery, $options: "i" } },
            ],
          },
        ],
      })
        .populate("author", "username")
        .sort({ createdAt: -1 });
    }

    // SEO metadata for search page
    const seo = {
      title: searchQuery
        ? `Résultats pour "${searchQuery}" - Mathématiques Bac Marocain`
        : "Recherche - Mathématiques Bac Marocain",
      description: searchQuery
        ? `${posts.length} résultat(s) trouvé(s) pour "${searchQuery}". Exercices corrigés de mathématiques pour le baccalauréat marocain.`
        : "Recherchez parmi nos exercices corrigés de mathématiques pour le bac marocain.",
      keywords: `recherche, ${searchQuery || "exercices"}, mathématiques, bac maroc`,
      canonical: `https://www.mathematiques-bac.org/search${searchQuery ? "?q=" + encodeURIComponent(searchQuery) : ""}`,
      ogImage: "https://www.mathematiques-bac.org/assets/img/home-bg.jpg",
    };

    res.render("search", {
      posts: posts,
      searchQuery: searchQuery || "",
      resultsCount: posts.length,
      seo,
      showAds: false,
      noindex: true, // Prevent search page from being indexed
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Search error");
  }
};

//register
exports.register = (req, res) => {
  res.render("register", { showAds: false, noindex: true });
};
