import { Ordermodel } from "../models/order.model.js";
import { Purchase } from "../models/purchasemodel.js";


export const orderdetails = async (req, res) => {
    try {
        const order = req.body;
        const orderInfo = await Ordermodel.create(order);

        console.log(orderInfo);

        const userId = orderInfo?.userId;
        const courseId = orderInfo?.courseId;

        res.status(201).json({ message: "Order Details: ", orderInfo });

        if (orderInfo) {
            await Purchase.create({ userId, courseId });
        }
    } catch (error) {
        console.log("Error in order: ", error);
        res.status(401).json({ errors: "Error in order creation" });
    }
};
