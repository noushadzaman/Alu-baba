import { categoryModel } from "@/models/category-model";
import { orderModel } from "@/models/order-model";
import { productModel } from "@/models/product-model";
import { userModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { calculatePrice, transformArray, transformObj } from "@/utils";

export async function getUserByEmail(email) {
  await dbConnect();
  const user = await userModel.findOne({ email: email }).lean();
  return user;
}

export async function updateUser(newUser) {
  await dbConnect();
  const user = await userModel.findById(newUser?._id);
  if (user) {
    if (newUser.phone_number) {
      user.phone_number = newUser.phone_number;
    }
    if (newUser.shipping_address) {
      user.shipping_address = newUser.shipping_address;
    }
    if (newUser.shipping_address_number) {
      user.shipping_address_number = newUser.shipping_address_number;
    }
    if (newUser.billing_address) {
      user.billing_address = newUser.billing_address;
    }
    if (newUser.billing_address_number) {
      user.billing_address_number = newUser.billing_address_number;
    }
  }
  user.save();
}

export async function addToWishList(userEmail, productId) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: userEmail });
    if (user) {
      if (!user.wishlist) {
        user.wishlist = [];
      }
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      } else {
        const newWishes = user.wishlist.filter((wish) => wish !== productId);
        user.wishlist = newWishes;
        await user.save();
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating wishlist", error);
  }
}

export async function addToCart(userEmail, productId, items) {
  await dbConnect();
  try {
    const product = await productModel.findById(productId);
    if (product) {
      const newQuantity = product.quantity - items;
      product.quantity = newQuantity;
      await product.save();
    } else {
      console.log("Product not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  try {
    const user = await userModel.findOne({ email: userEmail });
    if (user) {
      if (!user.cart_items) {
        user.cart_items = [];
      }
      const found = user.cart_items.find(
        (item) => item.productId === productId
      );
      if (!found) {
        user.cart_items.push({ productId, number: items });
        await user.save();
        return;
      } else {
        const deletedItem = user.cart_items.find(
          (cartItem) => cartItem.productId === productId
        );
        if (deletedItem?.number === items) {
          const filteredCart = user.cart_items.filter(
            (cartItem) => cartItem.productId !== productId
          );
          user.cart_items = filteredCart;
          await user.save();
          return;
        } else {
          const filteredCart = user.cart_items.filter(
            (cartItem) => cartItem.productId !== productId
          );
          const newCart = [
            ...filteredCart,
            { productId, number: deletedItem.number - items },
          ];
          user.cart_items = newCart;
          await user.save();
          return;
        }
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error updating wishlist", error);
  }
}

export async function getAllProducts(
  product,
  category,
  min_price,
  max_price,
  size
) {
  await dbConnect();
  const regex = new RegExp(product, "i");
  let products = await productModel
    .find({ name: { $regex: regex } })
    .select(["name", "thumbnail", "price", "discount", "category", "size"])
    .lean();

  if (category) {
    const categoriesToMatch = decodeURI(category).split("|");
    products = products.filter((product) =>
      categoriesToMatch.includes(product.category)
    );
  }

  if (min_price && max_price) {
    products = products.filter((product) => {
      return (
        calculatePrice(product?.discount, product?.price) >= min_price &&
        calculatePrice(product?.discount, product?.price) <= max_price
      );
    });
  }
  if (size) {
    products = products.filter((product) => product?.size === size);
  }

  return transformArray(products);
}

export async function getProductById(id) {
  await dbConnect();
  const product = await productModel.findById(id).lean();
  return transformObj(product);
}

export async function placeOrder(orderData, email) {
  await dbConnect();
  const product = new orderModel(orderData);
  const response = await product.save();
  const user = await userModel.findOne({ email: email });
  if (user) {
    user.cart_items = [];
    await user.save();
  }
  return response;
}

export async function clickCount(productId) {
  await dbConnect();
  const product = await productModel.findById(productId);
  product.click_count = product.click_count + 1;
  const response = await product.save();
  return response;
}

export async function getTrendingProduct() {
  await dbConnect();
  const products = await productModel
    .find({ click_count: { $exists: true, $ne: 0 } })
    .sort({ click_count: -1 })
    .limit(8)
    .lean();
  return transformArray(products);
}

export async function getNewArrivalProducts() {
  await dbConnect();
  const products = await productModel.find().sort({ date: -1 }).limit(4).lean();
  return transformArray(products);
}

export async function getCategories() {
  await dbConnect();
  const categories = await categoryModel.find().lean();
  return transformArray(categories);
}

export async function getRelatedProducts(category) {
  await dbConnect();
  let products = await productModel
    .find({ category: category })
    .select(["name", "thumbnail", "price", "discount", "category", "size"])
    .limit(4)
    .lean();
  return transformArray(products);
}
