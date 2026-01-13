import { Ordermodel } from "../models/order.model.js";
import { Purchase } from "../models/purchasemodel.js";
import crypto from 'crypto';
import { RAZORPAY_KEY_SECRET } from "../config.js";


export const orderdetails = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, courseId, amount } = req.body;

        // Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ errors: "Payment verification failed" });
        }

        // Create order record
        const order = {
            userId,
            courseId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: amount / 100, // Convert paise to rupees
            status: "success"
        };

        const orderInfo = await Ordermodel.create(order);
        console.log(orderInfo);

        res.status(201).json({ message: "Payment verified and order created", orderInfo });

        // Create purchase record
        if (orderInfo) {
            await Purchase.create({ userId, courseId });
        }
    } catch (error) {
        console.log("Error in order: ", error);
        res.status(401).json({ errors: "Error in order creation" });
    }
};
