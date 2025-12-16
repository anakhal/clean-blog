const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Category = require("../models/Category");

exports.index = async (req, res) => {
  try {
    const category = req.query.category;
    const query = {
      isDeleted: { $ne: true },
      type: "exercise", // Only show exercises, not solutions
    };

    if (category) {
      query.category = category;
    }

    const categories = await Category.find().sort({ name: 1 });

    const posts = await BlogPost.find(query)
      .populate("author", "username")
      .sort({ title: 1 }); // Tri alphabétique par titre

    // SEO metadata for homepage
    const seo = {
      title: category
        ? `${category} - Exercices Corrigés Bac Marocain | Mathématiques-Bac.org`
        : "Mathématiques Bac Marocain - Exercices Corrigés, Cours et Examens Nationaux",
      description: category
        ? `Exercices corrigés de ${category} pour le baccalauréat marocain. Solutions détaillées et cours complets pour réussir votre bac sciences mathématiques.`
        : "Plus de 500 exercices corrigés de mathématiques pour le bac marocain. Arithmétique, algèbre, probabilités, nombres complexes et plus. Préparation complète pour l'examen national.",
      keywords: category
        ? `${category.toLowerCase()}, bac maroc, exercices corrigés, mathématiques, sciences maths`
        : "mathématiques bac marocain, exercices corrigés, examen national, sciences maths, arithmétique, algèbre, probabilités, nombres complexes, espaces vectoriels, structures algébriques",
      canonical: category
        ? `https://www.mathematiques-bac.org/?category=${encodeURIComponent(category)}`
        : "https://www.mathematiques-bac.org/",
      ogImage: "https://www.mathematiques-bac.org/assets/img/home-bg.jpg",
    };

    res.render("index", { posts, categories, category: category || null, seo });
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
    });
  } catch (err) {
    console.error(err);
    res.render("create", {
      categories: [],
      exerciseId: undefined,
      exercise: null,
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
      category: req.body.category || "Arithmétique",
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
      description: `${cleanBody}... Solution détaillée pour ${post.category || "mathématiques"} - Bac Marocain`,
      keywords: `${post.category?.toLowerCase() || "mathématiques"}, exercice corrigé, bac maroc, ${cleanTitle.toLowerCase()}, solution mathématiques`,
      canonical: `https://www.mathematiques-bac.org/post/${post._id}`,
      ogImage: "https://www.mathematiques-bac.org/assets/img/post-bg.jpg",
    };

    res.render("post", { post, seo });
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Search error");
  }
};

//register
exports.register = (req, res) => {
  res.render("register");
};
