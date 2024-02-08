const PerModel = require("../models/main/per");
const ItemLineModel = require("../models/main/itemLine");

const catchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");

/**
 * @function getPer
 * * Gets the Per data based on item_line from the database.
 *
 * @param {object} req - Express request object, *expects an item_line in params.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 *
 * @throws {AppError} If the item line is not found.
 *
 * @returns {object} JSON response with status, message, and data.
 */
exports.getPer = catchAsync(async (req, res, next) => {
  const per = await PerModel.find({ item_line: req.params.item_line });

  if (per.length === 0) {
    return next(new AppError("Item line not found", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Item line was found",
    data: per,
  });
});
