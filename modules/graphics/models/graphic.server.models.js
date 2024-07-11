const mongoose = require("mongoose");

const graphicSchema = new mongoose.Schema(
    {
        uid: { type: String },
        title: { type: String },
        slug: { type: String },
        image: { type: String },
        imageUrl: { type: String },
        shortDesc: { type: String },
        footerText: { type: String },
        status: { type: Number, comment: "0 Inactive, 1 Active, 2 Deleted" },
        palette: { type: Object },

        createdAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        updatedAt: { type: Date },
        updatedBy: { type: mongoose.Schema.Types.ObjectId },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId },
    }
);

const graphicModel = mongoose.model("graphics", graphicSchema);
module.exports = graphicModel;