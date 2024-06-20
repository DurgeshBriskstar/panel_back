const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        uid: { type: String },
        title: { type: String },
        slug: { type: String },
        type: { type: String, comment: "city/category" },
        image: { type: String },
        imageUrl: { type: String },
        showInNav: { type: Boolean },
        orderInNav: { type: Number },
        shortDesc: { type: String },
        description: { type: String },
        status: { type: Number, comment: "0 Inactive, 1 Active, 2 Deleted" },

        metaKeywords: { type: Array },
        metaTitle: { type: String },
        metaDesc: { type: String },

        createdAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        updatedAt: { type: Date },
        updatedBy: { type: mongoose.Schema.Types.ObjectId },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId },
    }
);

const categoryModel = mongoose.model("categories", categorySchema);
module.exports = categoryModel;