import mongoose from 'mongoose';

const DataSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    short_des: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String },
    stock: { type: String },
    star: { type: String },
    remark: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const productModel = mongoose.model('products', DataSchema);

export default productModel;
