import Order from "../models/Order.js";
import Product from "../models/product.js";
import Stripe from "stripe";
import User from "../models/user.js";

//Place Order Cod : /api/order/cod
export const placeOrderCod = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by authUser middleware
    const { items, address } = req.body;
    if (!userId || items.length == 0 || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }
    // Calculate amount using  Items
    // const amount = await items.reduce(async (acc, item) => {
    //     const product = await Product.findById(item.product);
    //     return acc + item.quantity * product.price;
    // }, 0);
    const amounts = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return item.quantity * product.price;
      })
    );

    let amount = amounts.reduce((acc, val) => acc + val, 0);

    amount += Math.floor(amount * 0.02); // Adding 2% tax to the total amount

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by authUser middleware
    const { origin } = req.headers;
    const { items, address } = req.body;
    if (!userId || items.length == 0 || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }
    let productData = [];

    const amounts = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        productData.push({
          name: product.name,
          price: product.offerPrice,
          quantity: item.quantity,
        });
        return item.quantity * product.price;
      })
    );

    let amount = amounts.reduce((acc, val) => acc + val, 0);

    amount += Math.floor(amount * 0.02); // Adding 2% tax to the total amount

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      // isPaid: true
    });
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    // create  line items for stripe
    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "AUD",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });
    //create session

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.status(201).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Stripe webhook  to verify Payments Action :/stripe
export const stripeWebhooks = async (request, response) => {
  //Stripe GateWay initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
  //handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;
      // Mark Payment as paid
      await Order.findById(orderId, { isPaid: true });
      // clear user data
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case "payment_intent.failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  response.json({ received: true });
};

// Get  Orders by User Id :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by authUser middleware
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//Get All Orders (for seller /admin) : /api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
