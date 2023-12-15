const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Authenticate = require("../middleware/Authenticate");
const stripe = require("stripe")("sk_test_51NxuORSJjSNbQ9dejfeD3JHuIt1vy77zvDfMfwMpUyOeYonEVQ2phNoaQL0HODA7kT6EDKMPUAYDCJA5X7eMefDc00WI9Wjuwy")
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'meghshah0410@gmail.com',
        pass: 'dlqt mqqp oobu cxok',
    },
});


require('../db/conn');
// const User = require('../model/userSchema');
const Userss = require('../model/userSchemass');
// const Admin = require('../model/adminSchema');
const PizzaMenuItem = require('../model/pizzaMenuItemSchema');
// const Ingredient = require('../model/ingredientSchema');
const Offer = require('../model/offerSchema');
const Order = require('../model/orderSchema');
const OrderDetail = require('../model/orderDetailSchema');
const Cart = require('../model/cartSchema');
const Payment = require('../model/paymentSchema');
const Shop = require('../model/shopSchema');
const Toping = require('../model/topingSchema');




router.get('/', (req, res) => {
    res.send(`Hello world from server`);
})



//for register
router.post('/sign', async (req, res) => {
    const { name, email, phone, password, cpassword, type, secretKey, shopID } = req.body;
    console.log(req.body);

    if (!name || !email || !phone || !password || !cpassword || !type) {
        return res.status(422).json({ error: "Please fill in all required fields." });
    }

    try {
        const userExist = await Userss.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "User already exists." });
        }

        else if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match." });
        }

        if (type === 'admin') {
            if (secretKey !== 'admin') {
                return res.status(403).json({ error: "Invalid secret key for admin registration." });
            }
        }

        const user = new Userss({ name, email, phone, password, cpassword, type, secretKey, shopID });

        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});





// for login 
router.post('/login', async (req, res) => {

    try {
        // console.log(req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please filled the data." });
        }


        const userLogin = await Userss.findOne({ email: email });
        console.log(userLogin);


        if (userLogin != null) {


            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {

                res.status(400).json({ error: "Invalid Credentials." });
            } else {

                const token = await userLogin.generateAuthToken();
                console.log(token)

                // for cookies
                // this cookie will save on your browser which you are using for login 
                // name of cookies is left side and right side is actual token
                // pass third parameter fr=or the expire token
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                if (userLogin.type === 'admin') {
                    return res.status(200).json({ message: "Admin login successfully" });
                }
                else {
                    return res.status(201).json({ message: "User login successfully" });
                }

            }


        } else {

            res.status(400).json({ error: "Invalid Credentials...   " });

        }

    } catch (err) {

        console.log(err);

    }
})


//for add to cart form user
router.post('/addtocart', Authenticate, async (req, res) => {
    try {

        if (req.status === 401) {
            return res.status(401).json({ error: 'Please Login' });

        }
        const { itemName, size, quantity } = req.body;
        console.log("Item Name Received:", itemName);
        console.log("Size:", size);
        console.log("Quantity:", quantity);

        const userId = req.rootUser._id;

        const menuItem = await PizzaMenuItem.findOne({ itemName: itemName });
        console.log("Menu:", menuItem);


        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        const selectedSize = menuItem.sizes[size];
        console.log("selectedSize", selectedSize);


        if (!selectedSize) {
            return res.status(400).json({ error: 'Invalid size selected' });
        }

        const totalPrice = selectedSize.price * quantity;


        const cart = await Cart.findOne({ userID: userId, shopID: menuItem.shopID });

        if (!cart) {
            const newCart = new Cart({
                userID: userId,
                shopID: menuItem.shopID,
                items: [
                    {
                        menuItem: menuItem._id,
                        itemName: menuItem.itemName,
                        size: size,
                        quantity: quantity,
                        price: selectedSize.price,
                        totalPrice: totalPrice
                    }
                ]
            });
            await newCart.save();
        } else {
            const existingItem = cart.items.find(
                item => item.menuItem.toString() === menuItem._id.toString() && item.size === size
            );

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice += totalPrice;
            } else {
                cart.items.push({
                    menuItem: menuItem._id,
                    itemName: menuItem.itemName,
                    size: size,
                    quantity: quantity,
                    price: selectedSize.price,
                    totalPrice: totalPrice
                });
            }
            await cart.save();
        }

        res.status(201).json({ message: 'Menu item added to cart successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



//for placed order
router.post('/order', Authenticate, async (req, res) => {
    try {

        const { discountPrice  } = req.body;

        console.log(discountPrice);


        console.log("Call /order api")
        const userId = req.rootUser._id;

        const userDetail = await Userss.findOne({_id :userId});

        const cart = await Cart.findOne({ userID: userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemsInCart = cart.items;

        if (itemsInCart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const totalAmount = itemsInCart.reduce((total, item) => total + item.totalPrice, 0);

        const order = new Order({
            userID: userId,
            shopID: cart.shopID,
            orderDate: new Date(),
            totalAmount: discountPrice,
            orderStatus: 'Pending',
            paymentStatus: 'Completed'
        });

        console.log(order.shopID);

        await order.save();

        const orderDetails = new OrderDetail({
            orderID: order._id,
            items: itemsInCart.map(item => ({
                menuItem: item.menuItem,
                itemName: item.itemName,
                size: item.size,
                quantity: item.quantity
            }))
        });

        await orderDetails.save();

        const userEmail = req.rootUser.email; // replace with the user's email
        const subject = "Order has been placed successfully";
        // const text = `Your order with ID ${orderId} has been updated to ${orderStatus}.`;

        const itemHtml = cart.items.map(item => {
            return `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.size}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.totalPrice}</td>
                </tr>
            `;
        }).join('');
        
// console.log(itemsHtml)
        
        const html =`<h2>Hello ${userDetail.name}</h2>
                    <h3>Your order with ID ${order._id} has been successfull placed.</h3>
                    <h3>Please Pick up your order within 30 minites.</h3> 
                    <h4>Order Details:</h4>
                    <table border="1" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemHtml}
                        </tbody>                       
                    </table>

                    <h3>Total Amount :${discountPrice}</h3>
                    `;


        console.log("useremail :", userEmail);
        const mailOptions = {
            from: 'meghshah0410@gmail.com', // replace with your Gmail email
            to: userEmail,
            subject: subject,
            // text: text,
            html:html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
            console.log("mail transfer");
        });


        // Remove items from the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get user for admin
router.get('/getuserdetail', async (req, res) => {
    try {
        const User_Record = await Userss.find({});

        console.log(User_Record);
        res.json(User_Record);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//get order for admin
router.get('/getorder', async (req, res) => {
    try {
        const Order_Record = await Order.find({});

        console.log(Order_Record);

        const orderDates = Order_Record.map(order => {
            const date = new Date(order.orderDate);
            const formattedDate = date.toISOString().split('T')[0];
            return formattedDate;
        });
        console.log(orderDates);

        const response = {
            orderDates: orderDates,
            Order_Record: Order_Record

        };

        // const userOrderDetails = await OrderDetail.find({ orderID: orderId });
        // console.log(response);
        res.json(response);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getUser/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;

        // Find the shop based on shopID
        const user = await Userss.findOne({ _id: userID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract the shop name from the shop document
        const userName = user.name;
        // console.log(userName);

        // Return the shop details as JSON
        res.json({ userName });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Define the route for fetching shop details by shopID
router.get('/getShop/:shopID', async (req, res) => {
    try {
        const shopID = req.params.shopID;

        // Find the shop based on shopID
        const shop = await Shop.findOne({ _id: shopID });

        if (!shop) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // Extract the shop name from the shop document
        const shopName = shop.shopName;

        // Return the shop details as JSON
        res.json({ shopName });
    } catch (error) {
        console.error('Error fetching shop details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//get order detial for admin
router.get('/getorderdetail', async (req, res) => {
    try {
        const Order_Detail = await OrderDetail.find({});



        res.json(Order_Detail);


    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//update order status for admin
router.put('/updateOrderStatus/:orderId', async (req, res) => {
    const { orderStatus } = req.body;
    const { orderId } = req.params;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { orderStatus } },
            { new: true }
        );

        const orderDetail = await Order.findOne({ _id: orderId })

        // console.log("Details :", orderDetail);

        const extraDetail = await OrderDetail.findOne({orderID : orderId})
        console.log("Order extra detail",extraDetail)

        const userDetail = await Userss.findOne({ _id: orderDetail.userID })
        console.log("User Emails :", userDetail.email);

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const userEmail = userDetail.email; // replace with the user's email
        const subject = "Order Status Update";
        // const text = `Your order with ID ${orderId} has been updated to ${orderStatus}.`;

        const itemsHtml = extraDetail.items.map(item => {
            return `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.size}</td>
                    <td>${item.quantity}</td>
                </tr>
            `;
        }).join('');
        
// console.log(itemsHtml)
        
        const html =`<h2>Hello ${userDetail.name}</h2>
                    <h3>Your order with ID ${orderId} has been updated to ${orderStatus}.</h3>
                    <h3>Please Pick up your order within 10 minites.</h3> 
                    <h4>Order Details:</h4>
                    <table border="1" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Size</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <h3>Total Amount :${orderDetail.totalAmount}</h3>
                    <h3>Payment Status :${orderDetail.paymentStatus}</h3>
                    `;


        console.log("useremail :", userEmail);
        const mailOptions = {
            from: 'meghshah0410@gmail.com', // replace with your Gmail email
            to: userEmail,
            subject: subject,
            // text: text,
            html:html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
            console.log("mail transfer");
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get pizza for menu
router.get('/getpizza', async (req, res) => {
    try {
        const pizzas = await PizzaMenuItem.find({});
        res.json(pizzas);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//get cart for cart page for particular user
// router.get('/getcart', Authenticate, async (req, res) => {
//     try {

//         const userId = req.rootUser._id;
//         console.log("user:", userId)
//         const userEmail = req.rootUser.email;
//         console.log("email:", userEmail)

//         const carts = await Cart.findOne({ userID: userId });

//         console.log(carts);


//         res.json(carts);
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// })
router.get('/getcart', Authenticate, async (req, res) => {
    try {
        const userId = req.rootUser._id;
        console.log("user:", userId);

        const userEmail = req.rootUser.email;
        console.log("email:", userEmail);

        const carts = await Cart.findOne({ userID: userId });

       
        res.json(carts);

      
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})





//get toppinf=gs for admin dashboard
router.get('/gettoppings', async (req, res) => {
    try {
        const toppings = await Toping.find();
        res.json(toppings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//additem for admin dashboard
router.post('/addItem', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:", userId)
        const userEmail = req.rootUser.email;
        console.log("email:", userEmail)

        const { itemName, description, sizes, image } = req.body;

        const admin = await Userss.findOne({ email: userEmail });
        // const admin = await Userss.findOne({ userID: userId });
        console.log("admina:", admin);
        if (!admin || admin.type !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }


        const newItem = new PizzaMenuItem({
            shopID: admin.shopID,
            itemName,
            description,
            sizes,
            image,
        });

        await newItem.save();

        res.status(201).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//delete item for admin dashboard
router.delete('/deleteItems/:itemId', Authenticate, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and delete the pizza menu item by ID
        const deletedItem = await PizzaMenuItem.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Pizza menu item not found' });
        }

        res.status(200).json({ message: 'Pizza menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza menu item:', error);
        res.status(500).json({ message: 'Failed to delete pizza menu item' });
    }
});


//update item for admin dashboard
router.put('/updateItems/:itemId', Authenticate, async (req, res) => {
    const { itemId } = req.params;
    const updateData = req.body;

    try {
        // Find the item by ID and update it
        const updatedItem = await PizzaMenuItem.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true } // Return the updated item
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//delete topping for admin dashboard
router.delete('/deleteTopping/:itemId', Authenticate, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and delete the topping by ID
        const deletedTopping = await Toping.findByIdAndDelete(itemId);

        if (!deletedTopping) {
            return res.status(404).json({ message: 'Topping not found' });
        }

        res.status(200).json({ message: 'Topping deleted successfully' });
    } catch (error) {
        console.error('Error deleting topping:', error);
        res.status(500).json({ message: 'Failed to delete topping' });
    }
});

//update toppings for admin dashboard
router.put('/updateToppings/:itemId', Authenticate, async (req, res) => {
    const { itemId } = req.params;
    const updateData = req.body;

    try {
        // Find the topping by ID and update it
        const updatedItem = await Toping.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true } // Return the updated topping
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Topping not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating topping:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//get item for pizza in admin dashboard
router.get('/getItems', Authenticate, async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const pizzaItems = await PizzaMenuItem.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        res.status(200).json(pizzaItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//get item for topping in admin dashboard
router.get('/getItemsss', Authenticate, async (req, res) => {
    try {
        const TopingItems = await Toping.find();

        res.status(200).json(TopingItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add topping for admin
router.post('/addTopping', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:", userId)
        const userEmail = req.rootUser.email;
        console.log("email:", userEmail)

        const { toppingName, price } = req.body;

        const admin = await Userss.findOne({ email: userEmail });
        console.log("admina:", admin);
        if (!admin || admin.type !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }


        const newItem = new Toping({
            toppingName, price
        });

        await newItem.save();

        res.status(200).json({ message: 'Topping  added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//get item for offer in admin dashboard
router.get('/getOfferItems', Authenticate, async (req, res) => {
    try {
        const OfferItems = await Offer.find();

        console.log(OfferItems);

        res.status(200).json(OfferItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// add offer for admin
router.post('/addOffer', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:", userId)
        const userEmail = req.rootUser.email;
        console.log("email:", userEmail)

        const { shopID, offerName, discountPercentage, isActive } = req.body;

       
        const admin = await Userss.findOne({ email: userEmail });
        // console.log("admina:", admin);
        if (!admin || admin.type !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }

        console.log("hello")

        const newItem = new Offer({
            shopID ,offerName, discountPercentage, isActive
        });

        await newItem.save();

        console.log("after hello")

        res.status(200).json({ message: 'Offer  added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//update offer for admin dashboard
router.put('/updateOffer/:itemId', Authenticate, async (req, res) => {
    const { itemId } = req.params;
    const updateData = req.body;

    try {
        // Find the topping by ID and update it
        const updatedItem = await Offer.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true } // Return the updated topping
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating topping:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//delete offer for admin dashboard
router.delete('/deleteOffer/:itemId', Authenticate, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and delete the topping by ID
        const deletedOffer = await Offer.findByIdAndDelete(itemId);

        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting Offer:', error);
        res.status(500).json({ message: 'Failed to delete Offer' });
    }
});


//update offer status for admin
router.put('/updateOfferStatus/:itemId', async (req, res) => {
    const { isActive } = req.body;
    const { itemId } = req.params;

    try {
        const updatedOffer = await Offer.findByIdAndUpdate(
            itemId,
            { $set: { isActive } },
            { new: true }
            );
            res.status(200).json(updatedOffer);
            
       
    } catch (error) {
        console.error('Error updating OFFER status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/admin', Authenticate, async (req, res) => {
    console.log(`Hello Admin`);

    const userId = req.rootUser._id;

    const userEmail = req.rootUser.email;

    const admin = await Userss.findOne({ email: userEmail });

    if (!admin || admin.type !== 'admin') {
        return res.status(404).json({ error: 'Admin not found' });
    }

    res.send(req.rootUser);
});
router.get('/Cart', Authenticate, (req, res) => {
    console.log(`Hello my About`);
    res.send(req.rootUser);
});

//delete item from cart
router.delete('/deleteCartItem/:itemId', async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and remove the item from the cart
        const result = await Cart.updateOne(
            { 'items._id': itemId },
            { $pull: { items: { _id: itemId } } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Item not found in the cart' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//uopdate quantity in cart
router.patch('/updateCartItemQuantity/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    try {
        // Find and update the quantity of the item in the cart
        const result = await Cart.updateOne(
            { 'items._id': itemId },
            { $set: { 'items.$.quantity': quantity } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Item not found in the cart' });
        }

        res.json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Error updating quantity:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/logout', (req, res) => {
    console.log(`Hello my Logout`);
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send("User Logout.");
});
//   router.get('/carts', Authenticate, (req, res) => {
//     console.log(`Hello my About`);
//     res.send(req.rootUser);
//   });

router.put('/updateQuantity/:itemId', async (req, res) => {

    try {
        const { itemId } = req.params;
        console.log("Item:", itemId)
        const { newQuantity } = req.body;

        const cart = await Cart.findOne({ 'items._id': itemId });
        console.log("cart:", cart)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the specific item within the cart
        const cartItem = cart.items.find((item) => item._id.toString() === itemId);

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Update the quantity
        cartItem.quantity = newQuantity;

        // Save the changes
        await cart.save();

        // Respond with the updated cart or a success message
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});

router.delete('/removeFromCart/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;

        // Use Mongoose to find and delete the item by its unique _id
        const deletedItem = await CartItem.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        return res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error('Error removing item:', error.message);
        return res.status(500).json({ error: 'Failed to remove the item from the cart' });
    }
});

//for user your order page
router.get('/getuserorder', Authenticate, async (req, res) => {
    try {
        const userId = req.rootUser._id;

        const userOrders = await Order.find({ userID: userId });
        // console.log(userOrders);

        const orderStatus = userOrders.map(order => order.orderStatus);
        // console.log(orderStatus);

        // console.log(userOrders);
        // res.json(userOrders);
        // const orderDates = userOrders.map(order => order.orderDate);
        const orderDates = userOrders.map(order => {
            const date = new Date(order.orderDate);
            const formattedDate = date.toISOString().split('T')[0];
            return formattedDate;
        });
        const orderId = userOrders.map(order => order._id);
        const userOrderDetails = await OrderDetail.find({ orderID: orderId });

        const response = {
            orderDates: orderDates,
            orderStatus:orderStatus,
            userOrderDetails: userOrderDetails
        };

        // console.log(response);
        res.json(response);



    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//for payment gateway
router.post('/create-checkout-session', async (req, res) => {
    const { products,discountPrice } = req.body;

    const lineItems = products.map((product) => ({
        price_data: {

            currency: "inr",
            product_data: {

                name: product.itemName
            },
            unit_amount: product.price * 100,

        },

        quantity: product.quantity

    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/Cart",
        cancel_url: "http://localhost:3000/Cancel",

    })

    res.json({ id: session.id })

});
router.post('/change-password', Authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword, reenterNewPassword } = req.body;

        console.log(currentPassword)
        console.log(newPassword)
        console.log(reenterNewPassword)

        // Check if the new password and re-entered password match
        if (newPassword !== reenterNewPassword) {
            return res.status(400).json({ error: 'New password and re-entered password do not match.' });
        }

        const userLogin = await Userss.findOne({ email: req.rootUser.email });
        // console.log(userLogin);

        // Check if the current password is correct
        console.log("database password", userLogin.password)
        const isMatch = await bcrypt.compare(currentPassword, userLogin.password); // Use cpassword here
        console.log("match", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        // Update the password
        // req.Userss.password = newPassword;
        // req.Userss.cpassword = await bcrypt.hash(newPassword, 12);
        // await req.Userss.save();

        // Update the password
        userLogin.password = await bcrypt.hash(newPassword, 12);
        userLogin.cpassword = await bcrypt.hash(newPassword, 12);
        await userLogin.save();

        res.status(200).send({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.get('/getactiveoffer', async (req, res) => {
    try {
        
        const activeOffers = await Offer.find({ isActive: true });
        console.log("offer:", activeOffers);

        res.json(activeOffers);

       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//for admin sales
router.get('/dashboard/sales', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const dailySales = await Order.find({
            orderDate: { $gte: startOfDay, $lt: endOfDay },
        }).countDocuments();

        console.log("Daily: ",dailySales);

        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

        const weeklySales = await Order.find({
            orderDate: { $gte: startOfWeek, $lt: endOfWeek },
        }).countDocuments();

        console.log("Weekly: ",weeklySales);


        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const monthlySales = await Order.find({
            orderDate: { $gte: startOfMonth, $lt: endOfMonth },
        }).countDocuments();

        console.log("Monthly: ",monthlySales);


        const totalSales = await Order.find({}).countDocuments();

        console.log("Total: ",totalSales);

    const response = {
        daily: dailySales,
        weekly: weeklySales,
        monthly: monthlySales,
        total: totalSales,
    }
    console.log(response);
        res.json({
            response
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;