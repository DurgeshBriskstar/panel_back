const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        uid: { type: String },
        title: { type: String },
        slug: { type: String },
        image: { type: String },
        imageUrl: { type: String },
        categorySlug: { type: Array },
        citySlug: { type: Array },
        tags: { type: Array },
        type: { type: String },
        shortDesc: { type: String },
        description: { type: String },
        author: { type: String },
        source: { type: String },
        status: { type: Number, comment: "0 Inactive, 1 Active, 2 Deleted" },

        metaKeywords: { type: Array },
        metaTitle: { type: String },
        metaDesc: { type: String },

        publishDate: { type: Date },
        createdAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        updatedAt: { type: Date },
        updatedBy: { type: mongoose.Schema.Types.ObjectId },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId },
    }
);

const blogModel = mongoose.model("blogs", blogSchema);
module.exports = blogModel;