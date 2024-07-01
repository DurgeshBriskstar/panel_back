const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
    {
        uid: { type: String },
        title: { type: String },
        slug: { type: String },
        type: { type: String, comment: "blog/news" },
        image: { type: String },
        imageUrl: { type: String },
        shortDesc: { type: String },
        status: { type: Number, comment: "0 Inactive, 1 Active, 2 Deleted" },

        createdAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        updatedAt: { type: Date },
        updatedBy: { type: mongoose.Schema.Types.ObjectId },
        deletedAt: { type: Date },
        deletedBy: { type: mongoose.Schema.Types.ObjectId },
    }
);

const sliderModel = mongoose.model("sliders", sliderSchema);
module.exports = sliderModel;