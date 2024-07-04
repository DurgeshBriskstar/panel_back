const mongoose = require("mongoose");

const webSchema = new mongoose.Schema(
    {
        title: { type: String },
        subTitle: { type: String },
        category: { type: String },
        logo: { type: String },
        logoUrl: { type: String },

        aboutUs: { type: String },

        primaryEmail: { type: String },
        secondaryEmail: { type: String },
        primaryPhone: { type: String },
        secondaryPhone: { type: String },
        whatsAppPhone: { type: String },

        facebookLink: { type: String },
        linkedinLink: { type: String },
        instagramLink: { type: String },
        twitterLink: { type: String },
        pinterestLink: { type: String },
        youtubeLink: { type: String },

        streetAddress: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },

        createdAt: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId },
        updatedAt: { type: Date },
        updatedBy: { type: mongoose.Schema.Types.ObjectId },
    }
);

const webModel = mongoose.model("web_info", webSchema);
module.exports = webModel;