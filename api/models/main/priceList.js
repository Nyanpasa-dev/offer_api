const mongoose = require("mongoose");
const validator = require("validator");

const PersModel = require("./per");
const ItemLineModel = require("./itemLine");

const schema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "cc-destination",
      "inland-carrier",
      "forwarder",
      "inland-supplier",
      "local-charges",
    ],
    trim: true,
    maxLength: 40,
  },
  incoterm: {
    type: String,
    enum: ["DAP", "CIF", "EXW", "FOB", null],
    trim: true,
    maxlength: 50,
  },
  forwarder: {
    type: String,
    maxLength: 40,
    trim: true,
  },
  final_destination: {
    type: String,
    maxLength: 40,
    trim: true,
  },
  train_station: {
    type: String,
    maxLength: 40,
    trim: true,
  },
  sealine: {
    type: String,
    maxLength: 40,
    trim: true,
  },
  discharge_port: {
    type: String,
    maxLength: 40,
    trim: true,
  },
  inland_carrier: {
    loading_port: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    discharge_port: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  customs: {
    loading_port: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    discharge_port: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  valid_from: {
    type: Date,
    trim: true,
    required: [true, "Valid from have to be provided"],
  },
  valid_until: {
    type: Date,
    trim: true,
    required: [true, "Valid until have to be provided"],
  },
  details: {
    type: [
      {
        item_line: {
          type: String,
          trim: true,
          required: [true, "Item line have to be provided"],
          maxlength: 50,
        },
        supplier: {
          type: String,
          trim: true,
          required: [true, "Supplier have to be provided"],
          maxlength: 50,
        },
        price_20: {
          type: Number,
          trim: true,
          required: [true, "Price 20 have to be provided"],
          maxlength: 50,
        },
        price_40: {
          type: Number,
          trim: true,
          required: [true, "Price 40 have to be provided"],
          maxlength: 50,
        },
        currency_code: {
          type: String,
          default: "USD",
          trim: true,
          maxlength: 50,
        },
        per: {
          type: Boolean,
          required: true,
        },
      },
    ],
    validate: [
      {
        validator: function async(details) {
          const itemLines = details.map((detail) => detail.item_line);
          return itemLines.length === [...new Set(itemLines)].length;
        },
        message: "Item line must be unique within the same document",
      },
      {
        validator: function (details) {
          return (
            details.length > 0 && details.some((detail) => detail.item_line)
          );
        },
        message: "Details must contain at least one item line",
      },
    ],
  },
  activity: {
    type: String,
    trim: true,
    enum: ["Active", "Archived"],
    default: "Active",
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true,
  },
  senderInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

schema.pre("save", async function (next) {
  const promises = this.details.map(async (value) => {
    const existingItem = await PersModel.exists({ item_line: value.item_line });

    if (!existingItem) {
      const itemDetails = {
        item_line: value.item_line,
        per: value.per,
      };
      return PersModel.create(itemDetails);
    }
  });

  await Promise.all(promises);

  next();
});

schema.pre("save", async function (next) {
  const promises = this.details.map(async (value) => {
    const existingItem = await ItemLineModel.exists({
      item_line: value.item_line,
    });

    if (!existingItem) {
      const itemDetails = {
        item_line: value.item_line,
        per: value.per,
      };
      return ItemLineModel.create(itemDetails);
    }
  });

  await Promise.all(promises);

  next();
});
const PriceLists = mongoose.model("price_lists", schema);

module.exports = PriceLists;
