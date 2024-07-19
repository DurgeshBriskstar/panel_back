const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const { sendResponse } = require("../../helper/common");
const { STATUS_DELETED, STATUS_INACTIVE, STATUS_ACTIVE } = require("../../helper/flags");
const { webFormValidations } = require("../../helper/validations");
const webModel = require("../models/web.server.models");
const { convertUTCtoLocal, ensureDirectoryExistence, saveFileAndContinue } = require("../../../helper/common");
const { websitePath } = require("../../../helper/paths");

const Get = async (req, res) => {
  let pipeline = [
    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdByUser' } },
    { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedByUser' } },
    {
      $project: {
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

const Form = async (req, res) => {
  try {
    if (!req?.body) return sendResponse(res, false, 400, {}, "No data provided!");
    const formData = req.body;
    const formParams = req.params;
    const recordId = formParams.id || new mongoose.Types.ObjectId;
    const newRecord = formParams.id ? false : true;
    const type = formParams.type || 'general';

    let errors = webFormValidations(formData);
    if (Object.keys(errors).length) return sendResponse(res, false, 400, errors, "Validation failed!");

    let record = {};

    if (type === "general") {
      record.title = formData.title;
      record.subTitle = formData.subTitle;
      record.category = formData.category;
      record.aboutUs = formData.aboutUs;
      record.primaryEmail = formData.primaryEmail;
      record.secondaryEmail = formData.secondaryEmail;
      record.primaryPhone = formData.primaryPhone;
      record.secondaryPhone = formData.secondaryPhone;
      record.whatsAppPhone = formData.whatsAppPhone;
      record.streetAddress = formData.streetAddress;
      record.address = formData.address;
      record.city = formData.city;
      record.state = formData.state;
      record.pincode = formData.pincode;
      record.country = formData.country;
    } else {
      record.socialLinks = formData?.socialLinks || {};
    }

    record.updatedAt = new Date();
    record.updatedBy = req?.user?.id;

    if (formData?.image) {
      const matches = formData?.image?.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].split('/')[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const imageName = `${Date.now()}.${ext}`;
        const imagePath = path.join(websitePath.upload, imageName);

        // Ensure directory exists
        ensureDirectoryExistence(imagePath);
        const fileStatus = await saveFileAndContinue(imagePath, buffer);
        if (fileStatus) {
          record.logo = imageName;
          record.logoUrl = `${websitePath.get}/${imageName}`;
        }
      }
    } else {
      record.logo = "";
      record.logoUrl = "";
    }

    if (newRecord) {
      record.createdAt = new Date();
      record.createdBy = req?.user?.id;
    }

    const query = { title: formData.title };
    const existingRecord = await webModel.findOne(query);

    if (existingRecord && (existingRecord._id.toString() !== recordId)) {
      return sendResponse(res, false, 400, {}, "A record with the same title is already exists!");
    }

    const options = { new: true, upsert: true };
    const website = await webModel.findByIdAndUpdate(recordId, { $set: record }, options);
    const message = newRecord ? "Record saved successfully!" : "Record updated successfully!";

    return sendResponse(res, true, 200, website, message);
  } catch (error) {
    console.log(error);
    const transformedObject = {};
    for (const key in error?.errors) {
      if (error?.errors.hasOwnProperty(key)) {
        transformedObject[key] = error?.errors[key].message;
      }
    }
    return sendResponse(res, false, 400, {}, transformedObject);
  }
};

// const UpdateStatus = async (req, res) => {
//   const recordId = req?.params?.id || null;

//   if (recordId) {
//     const record = {
//       status: req?.body?.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
//       updatedAt: new Date(),
//       updatedBy: req?.user?.id,
//     };
//     const updatedCategory = await webModel.findByIdAndUpdate(
//       recordId,
//       { $set: record },
//       { new: true }
//     );
//     return sendResponse(res, true, 200, updatedCategory, "Status updated successfully!");
//   }
//   return sendResponse(
//     res,
//     false,
//     400,
//     {},
//     "No record selected, Please try again!"
//   );
// };

// const Delete = async (req, res) => {
//   const recordId = req?.params?.id || null;
//   if (recordId) {
//     const record = {
//       status: STATUS_DELETED,
//       deletedAt: new Date(),
//       deletedBy: req?.user?.id,
//     };
//     const updatedCategory = await webModel.findByIdAndUpdate(
//       recordId,
//       { $set: record },
//       { new: true }
//     );
//     return sendResponse(res, true, 200, {}, "Record removed successfully!");
//   }
//   return sendResponse(
//     res,
//     false,
//     400,
//     {},
//     "No record selected, Please try again!"
//   );
// };

module.exports = {
  Get,
  Form,
  // Delete,
  // UpdateStatus,
};