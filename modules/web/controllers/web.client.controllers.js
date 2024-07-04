const mongoose = require("mongoose");
const { sendResponse } = require("../../helper/common");
const { STATUS_ACTIVE } = require("../../helper/flags");
const webModel = require("../models/web.server.models");
const { convertUTCtoLocal } = require("../../../helper/common");

const Get = async (req, res) => {
  let pipeline = [
    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdByUser' } },
    { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedByUser' } },
    {
      $project: {
        _id: 0,
        title: "$title",
        subTitle: "$subTitle",
        category: "$category",
        logo: "$logo",
        logoUrl: "$logoUrl",

        aboutUs: "$aboutUs",

        primaryEmail: "$primaryEmail",
        secondaryEmail: "$secondaryEmail",
        primaryPhone: "$primaryPhone",
        secondaryPhone: "$secondaryPhone",
        whatsAppPhone: "$whatsAppPhone",

        facebookLink: "$facebookLink",
        linkedinLink: "$linkedinLink",
        instagramLink: "$instagramLink",
        twitterLink: "$twitterLink",
        pinterestLink: "$pinterestLink",
        youtubeLink: "$youtubeLink",

        streetAddress: "$streetAddress",
        address: "$address",
        city: "$city",
        state: "$state",
        pincode: "$pincode",
        country: "$country",


        createdAt: convertUTCtoLocal("$createdAt", "Asia/Kolkata"),
        updatedAt: convertUTCtoLocal("$updatedAt", "Asia/Kolkata"),
        createdByUser: { $concat: [{ $arrayElemAt: ["$createdByUser.firstName", 0] }, " ", { $arrayElemAt: ["$createdByUser.lastName", 0] }] },
        updatedByUser: { $concat: [{ $arrayElemAt: ["$updatedByUser.firstName", 0] }, " ", { $arrayElemAt: ["$updatedByUser.lastName", 0] }] },
      },
    },
  ];

  const webInfo = await webModel.aggregate(pipeline);

  return sendResponse(
    res,
    true,
    200,
    { web: webInfo[0] },
    "Record fetched successfully!"
  );
};

module.exports = {
  Get,
};