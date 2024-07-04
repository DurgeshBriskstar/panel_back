const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const { sendResponse, convertToSlug, generateRandomUid } = require("../../helper/common");
const { STATUS_DELETED, STATUS_INACTIVE, STATUS_ACTIVE } = require("../../helper/flags");
const { categoryFormValidations } = require("../../helper/validations");
const webModel = require("../models/web.server.models");
const { convertUTCtoLocal, ensureDirectoryExistence, saveFileAndContinue } = require("../../../helper/common");
const { categoryPath } = require("../../../helper/paths");

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

// const Form = async (req, res) => {
//   try {
//     if (!req?.body) return sendResponse(res, false, 400, {}, "No data provided!");
//     const formData = req.body;
//     const formParams = req.params;
//     const recordId = formParams.id || new mongoose.Types.ObjectId;
//     const newRecord = formParams.id ? false : true;

//     let errors = categoryFormValidations(formData);
//     if (Object.keys(errors).length) return sendResponse(res, false, 400, errors, "Validation failed!");

//     let record = {
//       title: formData.title,
//       slug: await convertToSlug(formData.title, categoryModel, recordId),
//       type: formData.isCity ? "city" : "category",
//       showInNav: formData.showInNav || false,
//       orderInNav: formData.orderInNav || null,
//       shortDesc: formData.shortDesc || "",
//       description: formData.description || "",
//       status: formData.active ? 1 : 0,

//       metaKeywords: formData.metaKeywords,
//       metaTitle: formData.metaTitle,
//       metaDesc: formData.metaDesc,

//       updatedAt: new Date(),
//       updatedBy: req?.user?.id,
//     };

//     if (formData?.image) {
//       const matches = formData?.image?.match(/^data:(.+);base64,(.+)$/);
//       if (matches) {
//         const ext = matches[1].split('/')[1];
//         const data = matches[2];
//         const buffer = Buffer.from(data, 'base64');
//         const imageName = `${Date.now()}.${ext}`;
//         const imagePath = path.join(categoryPath.upload, imageName);

//         // Ensure directory exists
//         ensureDirectoryExistence(imagePath);
//         const fileStatus = await saveFileAndContinue(imagePath, buffer);
//         if (fileStatus) {
//           record.image = imageName;
//           record.imageUrl = `${categoryPath.get}/${imageName}`;
//         }
//       }
//     } else {
//       record.image = "";
//       record.imageUrl = "";
//     }

//     if (newRecord) {
//       record.uid = generateRandomUid();
//       record.createdAt = new Date();
//       record.createdBy = req?.user?.id;
//     }

//     const query = { title: formData.title };
//     const existingRecord = await categoryModel.findOne(query);

//     if (existingRecord && (existingRecord._id.toString() !== recordId)) {
//       return sendResponse(res, false, 400, {}, "A record with the same title is already exists!");
//     }

//     const options = { new: true, upsert: true };
//     const category = await categoryModel.findByIdAndUpdate(recordId, { $set: record }, options);
//     const message = newRecord ? "Record saved successfully!" : "Record updated successfully!";

//     return sendResponse(res, true, 200, category, message);
//   } catch (error) {
//     console.log(error);
//     const transformedObject = {};
//     for (const key in error?.errors) {
//       if (error?.errors.hasOwnProperty(key)) {
//         transformedObject[key] = error?.errors[key].message;
//       }
//     }
//     return sendResponse(res, false, 400, {}, transformedObject);
//   }
// };

// const UpdateStatus = async (req, res) => {
//   const recordId = req?.params?.id || null;

//   if (recordId) {
//     const record = {
//       status: req?.body?.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
//       updatedAt: new Date(),
//       updatedBy: req?.user?.id,
//     };
//     const updatedCategory = await categoryModel.findByIdAndUpdate(
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
//     const updatedCategory = await categoryModel.findByIdAndUpdate(
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
  // Form,
  // Delete,
  // UpdateStatus,
};