const mongoose = require("mongoose");
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Category = require("../models/Category");

exports.index = async (req, res) => {
  try {
    // 1. Fetch all categories and build hierarchy
    const allCategories = await Category.find().sort({ name: 1 }).lean();

    // Build hierarchy recursively
    const buildHierarchy = (parentId) => {
      return allCategories
        .filter(c => (parentId ? (c.parent && c.parent.toString() === parentId.toString()) : !c.parent))
        .map(c => ({
          ...c,
          children: buildHierarchy(c._id)
        }));
    };
    const hierarchy = buildHierarchy(null);

    // 2. Handle Category Selection (Default to 'Algèbre' if none selected, but DON'T redirect)
    let categoryName = req.query.category;
    
    // 3. Determine Query based on selection
    const query = {
      isDeleted: { $ne: true },
      type: "exercise",
    };

    let selectedCategory = null;
    let targetCategoryName = categoryName;

    // If no category selected in URL, default to first parent (usually Algèbre) for content
    // but keep URL clean for SEO (no redirect)
    if (!targetCategoryName && hierarchy.length > 0) {
       targetCategoryName = hierarchy[0].name; // Default content source
    }

    if (targetCategoryName) {
      // Find the selected category object
      selectedCategory = allCategories.find(c => c.name === targetCategoryName);

      if (selectedCategory) {
        // Recursive function to get all descendant IDs
        const getDescendantIds = (categoryId) => {
            let ids = [];
            const children = allCategories.filter(c => c.parent && c.parent.toString() === categoryId.toString());
            for (const child of children) {
                ids.push(child._id);
                ids = ids.concat(getDescendantIds(child._id));
            }
            return ids;
        };

        const descendantIds = getDescendantIds(selectedCategory._id);
        
        // Query: category IN [this_category_id, ...all_descendant_ids]
        query.category = { $in: [selectedCategory._id, ...descendantIds] };
      } else {
        // Category name in URL doesn't exist in DB
        if (categoryName) {
            query.category = null; // Will result in 0 posts only if user explicitly asked for bad category
        }
      }
    }

    // Pagination setup (limit to 15 posts per page for optimal DOM size and Core Web Vitals)
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 15;
    const totalPosts = await BlogPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    const posts = await BlogPost.find(query)
      .populate("author", "username")
      .populate("category")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Build canonical and rel="prev"/"next" URLs for SEO
    const categoryParam = categoryName ? `category=${encodeURIComponent(categoryName)}` : "";
    const buildPageUrl = (p) => {
      const parts = [];
      if (categoryParam) parts.push(categoryParam);
      if (p > 1) parts.push(`page=${p}`);
      return parts.length > 0 ? `https://www.mathematiques-bac.org/?${parts.join("&")}` : "https://www.mathematiques-bac.org/";
    };

    const canonical = buildPageUrl(page);
    const prevPageUrl = page > 1 ? buildPageUrl(page - 1) : null;
    const nextPageUrl = page < totalPages ? buildPageUrl(page + 1) : null;

    // SEO metadata
    const seo = {
      title: categoryName
        ? `${categoryName}${page > 1 ? ` (Page ${page})` : ""} - Exercices Corrigés Bac & Lycée | Mathématiques-Bac.org`
        : (page > 1 ? `Exercices Corrigés (Page ${page}) - Mathématiques Bac & High School` : "Mathématiques Bac & High School Math - Exercices Corrigés"),
      description: categoryName
        ? `Exercices corrigés de ${categoryName}${page > 1 ? ` - Page ${page}` : ""}. Solutions détaillées pour le Bac et Lycée (High School).`
        : `Exercices corrigés de mathématiques pour le Baccalauréat et le Lycée${page > 1 ? ` - Page ${page}` : ""}. Mathematics exercises with solutions.`,
      keywords: categoryName
        ? `${categoryName.toLowerCase()}, bac math, exercices, high school math, lycée`
        : "mathématiques, bac math, exercices, high school math, terminale",
      canonical,
      prevPageUrl,
      nextPageUrl,
      ogImage: "https://www.mathematiques-bac.org/assets/img/home-bg.jpg",
    };

    const hasEnoughContent = posts.length >= 3;

    // Pass hierarchy, allCategories and pagination data to view
    res.render("index", {
      posts,
      categories: allCategories,
      hierarchy, // New hierarchical structure
      category: categoryName || null,
      seo,
      showAds: hasEnoughContent,
      pagination: {
        page,
        totalPages,
        totalPosts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
      },
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
    const identifier = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    let post = null;

    // Search by ObjectId first if valid format, otherwise search by slug
    if (isObjectId) {
      post = await BlogPost.findOne({
        _id: identifier,
        isDeleted: { $ne: true },
      })
        .populate("author", "username")
        .populate("category")
        .populate("solutionId")
        .populate("exerciseId");
    }

    if (!post) {
      post = await BlogPost.findOne({
        slug: identifier,
        isDeleted: { $ne: true },
      })
        .populate("author", "username")
        .populate("category")
        .populate("solutionId")
        .populate("exerciseId");
    }

    if (!post) {
      return res.status(404).send("Post not Found");
    }

    // 1. Redirection 301 : Les solutions autonomes redirigent vers leur exercice parent
    if (post.type === "solution" && post.exerciseId) {
      const parentTarget = post.exerciseId.slug || post.exerciseId._id || post.exerciseId;
      return res.redirect(301, `/post/${parentTarget}#solution`);
    }

    // 2. Redirection 301 vers le slug sémantique si la requête utilise l'ObjectId brut
    if (post.slug && isObjectId && identifier === post._id.toString() && identifier !== post.slug) {
      return res.redirect(301, `/post/${post.slug}`);
    }

    // SEO metadata for individual post
    const cleanTitle = (post.title || "Exercice").substring(0, 60);
    // Nettoyage des balises et de la syntaxe LaTeX brute pour une méta-description lisible
    const cleanBody = (post.body || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\$+/g, "")
      .replace(/\\(frac|sqrt|ln|int|sum|prod|alpha|beta|pi|quad|text)/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 150);

    const postIdentifier = post.slug || post._id;
    const categoryName = post.category?.name || "Mathématiques Bac";

    const seo = {
      title: `${cleanTitle} : Énoncé & Corrigé Détaillé - Bac & Lycée`,
      description: `${cleanBody}... Exercice et solution détaillée en ${categoryName} pour le Baccalauréat et le Lycée.`,
      keywords: `${categoryName.toLowerCase()}, exercice corrigé, bac math, ${cleanTitle.toLowerCase()}, solution mathématiques, high school math`,
      canonical: `https://www.mathematiques-bac.org/post/${postIdentifier}`,
      ogImage: "https://www.mathematiques-bac.org/assets/img/post-bg.jpg",
    };

    // 3. Navigation Précédent / Suivant et Exercices Similaires (Maillage Interne & Crawlability)
    let prevPost = null;
    let nextPost = null;
    let relatedPosts = [];

    if (post.category) {
      const categoryId = post.category._id || post.category;
      const baseFilter = {
        category: categoryId,
        type: "exercise",
        isDeleted: { $ne: true },
      };

      // Exercice précédent (créé avant dans la même catégorie)
      prevPost = await BlogPost.findOne({
        ...baseFilter,
        createdAt: { $lt: post.createdAt },
      })
        .sort({ createdAt: -1 })
        .select("title slug _id")
        .lean();

      // Exercice suivant (créé après dans la même catégorie)
      nextPost = await BlogPost.findOne({
        ...baseFilter,
        createdAt: { $gt: post.createdAt },
      })
        .sort({ createdAt: 1 })
        .select("title slug _id")
        .lean();

      // Exercices similaires recommandés dans le même chapitre (max 4)
      const excludeIds = [post._id];
      if (prevPost) excludeIds.push(prevPost._id);
      if (nextPost) excludeIds.push(nextPost._id);

      relatedPosts = await BlogPost.find({
        category: categoryId,
        type: "exercise",
        isDeleted: { $ne: true },
        _id: { $nin: excludeIds },
      })
        .sort({ createdAt: -1 })
        .limit(4)
        .select("title slug category createdAt _id")
        .populate("category", "name")
        .lean();
    }

    // 4. Fil d'Ariane (Breadcrumbs pour navigation et Schema.org)
    const breadcrumbs = [
      { name: "Accueil", url: "https://www.mathematiques-bac.org/" },
    ];
    if (post.category && post.category.name) {
      breadcrumbs.push({
        name: post.category.name,
        url: `https://www.mathematiques-bac.org/chapitre/${encodeURIComponent(post.category.name)}`,
      });
    }
    breadcrumbs.push({
      name: cleanTitle,
      url: `https://www.mathematiques-bac.org/post/${postIdentifier}`,
    });

    // Le contenu combiné (énoncé + solution intégrée) élimine le Thin Content
    const combinedText = (post.body || "") + (post.solutionId?.body || "");
    const textContent = combinedText.replace(/<[^>]*>/g, "").trim();
    const hasEnoughContent = textContent.length >= 200;

    res.render("post", {
      post,
      seo,
      showAds: hasEnoughContent,
      prevPost,
      nextPost,
      relatedPosts,
      breadcrumbs,
    });
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
        ? `Résultats pour "${searchQuery}" - Mathématiques Bac & High School`
        : "Recherche - Mathématiques Bac & High School",
      description: searchQuery
        ? `${posts.length} résultat(s) trouvé(s) pour "${searchQuery}". Exercices corrigés de mathématiques pour le baccalauréat et lycée.`
        : "Recherchez parmi nos exercices corrigés de mathématiques pour le bac et le lycée.",
      keywords: `recherche, ${searchQuery || "exercices"}, mathématiques, bac math, high school`,
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
