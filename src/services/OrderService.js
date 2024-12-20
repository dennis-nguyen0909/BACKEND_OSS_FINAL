const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const EmailService = require("../services/EmailService");

const getAllOrderDetailsByMonth = (month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({
        createdAt: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      }).sort({ createdAt: -1, updatedAt: -1 });

      if (!orders || orders.length === 0) {
        resolve({
          status: "ERR",
          message: "No orders found for the specified month and year",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: orders,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const createOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      paymentMethod,
      itemsPrice,
      totalPrice,
      shippingPrice,
      fullName,
      address,
      city,
      phone,
      user,
      orderItems,
      isPaid,
      PaidAt,
      email,
    } = data;
    try {
      const promise = orderItems?.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product, // lấy ra id sản phẩm
            countInStock: { $gte: order.amount }, // số lượng có sẵn
          },
          {
            $inc: {
              countInStock: -order.amount, // số lượng đang có trừ đi sản phẩm mua
              selled: +order.amount, // cập nhật số lượng đã bán đi
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "Ok",
            message: " SuccessFully!!",
          };
        } else {
          return {
            status: "Error",
            id: order.product,
          };
        }
      });
      const result = await Promise.all(promise);
      const newData = result && result.filter((item) => item?.id);
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          EC: 0,
          ES: "ERROR",
          EM: "Số lượng kho đã hết",
        });
      } else {
        const addOrder = await Order.create({
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          orderItems,
          paymentMethod,
          itemsPrice,
          totalPrice,
          shippingPrice,
          user: user,
          isPaid,
          PaidAt,
        });
        if (addOrder) {
          await EmailService.sendEmailCreateOrder(
            email,
            orderItems,
            totalPrice,
            paymentMethod,
            isPaid,
            PaidAt
          );
          resolve({
            EC: 1,
            ES: "SUCCESS",
            EM: "Mua thành công",
            addOrder,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
const getAllOder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = {
  getAllOrderDetailsByMonth,
  createOrder,
  getAllOder,
};
