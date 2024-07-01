const mongoose = require("mongoose");
const { sendResponse } = require("../../helper/common");
const { STATUS_ACTIVE } = require("../../helper/flags");
const categoryModel = require("../models/categories.server.models");
const { convertUTCtoLocal } = require("../../../helper/common");

const Get = async (req, res) => {
  const { id: recordId } = req.params || null;
  const page = req.body.page || 0;
  const rowsPerPage = req.body.rowsPerPage || 10;
  const search = req.body.search || '';
  const order = req.body.order || 'desc';
  const orderBy = req.body.orderBy || 'createdAt';
  const filterByType = req.body.type || null;
  const skip = page * rowsPerPage;

  const sortingColumn = { [orderBy]: order === 'desc' ? -1 : 1 };

  let matchQuery = {
    status: STATUS_ACTIVE,
    $or: [
      { title: { $regex: search, $options: 'i' } },
    ]
  };

  if (filterByType) {
    matchQuery.type = filterByType;
  }

  if (recordId) {
    matchQuery._id = new mongoose.Types.ObjectId(recordId);
  }

  let pipeline = [
    { $match: matchQuery },
    { $match: recordId ? { _id: new mongoose.Types.ObjectId(recordId) } : {} },

    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdByUser' } },
    { $sort: sortingColumn },
    {
      $project: {
        _id: 0,
        uid: "$uid",
        title: "$title",
        slug: "$slug",
        type: "$type",
        image: "$image",
        imageUrl: "$imageUrl",
        showInNav: "$showInNav",
        orderInNav: "$orderInNav",
        shortDesc: "$shortDesc",
        description: "$description",
        status: "$status",
        metaKeywords: "$metaKeywords",
        metaTitle: "$metaTitle",
        metaDesc: "$metaDesc",
        createdAt: convertUTCtoLocal("$createdAt", "Asia/Kolkata"),
        createdByUser: { $concat: [{ $arrayElemAt: ["$createdByUser.firstName", 0] }, " ", { $arrayElemAt: ["$createdByUser.lastName", 0] }] },
      },
    },
    { $skip: skip },
    { $limit: rowsPerPage }
  ];

  // Pipeline for fetching the total count
  let totalCountPipeline = [{ $match: matchQuery }, { $count: "total" }];
  // Fetching the total count
  const totalCountResult = await categoryModel.aggregate(totalCountPipeline);

  const categoryList = await categoryModel.aggregate(pipeline);

  const totalPages = Math.ceil(totalCountResult.length > 0 ? totalCountResult[0].total / rowsPerPage : 0);
  const totalCount = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

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
    { category: categoryList, count: totalCount },
    "Records fetched successfully!"
  );
};

module.exports = {
  Get,
};