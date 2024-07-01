const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const { sendResponse, convertToSlug, generateRandomUid } = require("../../helper/common");
const { STATUS_DELETED, STATUS_INACTIVE, STATUS_ACTIVE } = require("../../helper/flags");
const { sliderFormValidations } = require("../../helper/validations");
const sliderModel = require("../models/slider.server.models");
const { convertUTCtoLocal, ensureDirectoryExistence, saveFileAndContinue } = require("../../../helper/common");
const { sliderPath } = require("../../../helper/paths");

const Get = async (req, res) => {
  const { id: recordId } = req.params || null;
  const page = req.body.page || 0;
  const rowsPerPage = req.body.rowsPerPage || 10;
  const search = req.body.search || '';
  const order = req.body.order || 'desc';
  const orderBy = req.body.orderBy || 'createdAt';
  const filterByStatus = req.body.status || null;
  const skip = page * rowsPerPage;

  const sortingColumn = { [orderBy]: order === 'desc' ? -1 : 1 };

  let matchQuery = {
    status: filterByStatus ? parseInt(filterByStatus) : { $ne: STATUS_DELETED },
    $or: [
      { title: { $regex: search, $options: 'i' } },
    ]
  };

  if (recordId) {
    matchQuery._id = new mongoose.Types.ObjectId(recordId);
  }

  let pipeline = [
    { $match: matchQuery },
    { $match: recordId ? { _id: new mongoose.Types.ObjectId(recordId) } : {} },

    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdByUser' } },
    { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedByUser' } },
    { $sort: sortingColumn },
    {
      $project: {
        uid: "$uid",
        title: "$title",
        slug: "$slug",
        type: "$type",
        image: "$image",
        imageUrl: "$imageUrl",
        shortDesc: "$shortDesc",
        status: "$status",
        createdAt: convertUTCtoLocal("$createdAt", "Asia/Kolkata"),
        updatedAt: convertUTCtoLocal("$updatedAt", "Asia/Kolkata"),
        createdByUser: { $concat: [{ $arrayElemAt: ["$createdByUser.firstName", 0] }, " ", { $arrayElemAt: ["$createdByUser.lastName", 0] }] },
        updatedByUser: { $concat: [{ $arrayElemAt: ["$updatedByUser.firstName", 0] }, " ", { $arrayElemAt: ["$updatedByUser.lastName", 0] }] },
      },
    },
    { $skip: skip },
    { $limit: rowsPerPage }
  ];

  const totalCountPipeline = [...pipeline];
  totalCountPipeline.pop();
  totalCountPipeline.push({ $count: "total" });
  const totalCountResult = await sliderModel.aggregate(totalCountPipeline);

  const sliderList = await sliderModel.aggregate(pipeline);

  const totalPages = Math.ceil(totalCountResult.length > 0 ? totalCountResult[0].total / rowsPerPage : 0);

  const pagination = {
    totalItems: totalCountResult.length > 0 ? totalCountResult[0].total : 0,
    currentPage: page,
    totalPages: totalPages,
    itemsPerPage: rowsPerPage
  }

  return sendResponse(
    res,
    true,
    200,
    sliderList,
    "Records fetched successfully!"
  );
};

const Form = async (req, res) => {
  try {
    if (!req?.body) return sendResponse(res, false, 400, {}, "No data provided!");
    const formData = req.body;
    const formParams = req.params;
    const recordId = formParams.id || new mongoose.Types.ObjectId;
    const newRecord = formParams.id ? false : true;

    let errors = sliderFormValidations(formData);
    if (Object.keys(errors).length) return sendResponse(res, false, 400, errors, "Validation failed!");

    let record = {
      title: formData.title,
      slug: await convertToSlug(formData.title, sliderModel, recordId),
      type: formData?.isNews ? "news" : "blog",
      shortDesc: formData.shortDesc || "",
      status: formData.active ? 1 : 0,

      updatedAt: new Date(),
      updatedBy: req?.user?.id,
    };

    if (formData?.image) {
      const matches = formData?.image?.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].split('/')[1];
        const data = matches[2];
        const buffer = Buffer.from(data, 'base64');
        const imageName = `${Date.now()}.${ext}`;
        const imagePath = path.join(sliderPath.upload, imageName);

        // Ensure directory exists
        ensureDirectoryExistence(imagePath);
        const fileStatus = await saveFileAndContinue(imagePath, buffer);
        if (fileStatus) {
          record.image = imageName;
          record.imageUrl = `${sliderPath.get}/${imageName}`;
        }
      }
    } else {
      record.image = "";
      record.imageUrl = "";
    }

    if (newRecord) {
      record.uid = generateRandomUid();
      record.createdAt = new Date();
      record.createdBy = req?.user?.id;
    }

    const query = { title: formData.title };
    const existingRecord = await sliderModel.findOne(query);

    if (existingRecord && (existingRecord._id.toString() !== recordId)) {
      return sendResponse(res, false, 400, {}, "A record with the same title is already exists!");
    }

    const options = { new: true, upsert: true };
    const slider = await sliderModel.findByIdAndUpdate(recordId, { $set: record }, options);
    const message = newRecord ? "Record saved successfully!" : "Record updated successfully!";

    return sendResponse(res, true, 200, slider, message);
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

const UpdateStatus = async (req, res) => {
  const recordId = req?.params?.id || null;

  if (recordId) {
    const record = {
      status: req?.body?.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE,
      updatedAt: new Date(),
      updatedBy: req?.user?.id,
    };
    const updatedSlider = await sliderModel.findByIdAndUpdate(
      recordId,
      { $set: record },
      { new: true }
    );
    return sendResponse(res, true, 200, updatedSlider, "Status updated successfully!");
  }
  return sendResponse(
    res,
    false,
    400,
    {},
    "No record selected, Please try again!"
  );
};

const Delete = async (req, res) => {
  const recordId = req?.params?.id || null;
  if (recordId) {
    const record = {
      status: STATUS_DELETED,
      deletedAt: new Date(),
      deletedBy: req?.user?.id,
    };
    const updatedSlider = await sliderModel.findByIdAndUpdate(
      recordId,
      { $set: record },
      { new: true }
    );
    return sendResponse(res, true, 200, {}, "Record removed successfully!");
  }
  return sendResponse(
    res,
    false,
    400,
    {},
    "No record selected, Please try again!"
  );
};

module.exports = {
  Get,
  Form,
  Delete,
  UpdateStatus,
};