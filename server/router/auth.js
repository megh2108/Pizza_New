const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Authenticate = require("../middleware/Authenticate");


require('../db/conn');
const User = require('../model/userSchema');
const Userss = require('../model/userSchemass');
const Admin = require('../model/adminSchema');
const PizzaMenuItem = require('../model/pizzaMenuItemSchema');
// const Pizza = require('../model/pizzaSchema');
// const User1 = require('../model/user1Schema');
// const MenuItem = require('../model/menuItemSchema');
const Ingredient = require('../model/ingredientSchema');
const Offer = require('../model/offerSchema');
const Order = require('../model/orderSchema');
const OrderDetail = require('../model/orderDetailSchema');
const Cart = require('../model/cartSchema');
const Payment = require('../model/paymentSchema');
const Shop = require('../model/shopSchema');
const Toping = require('../model/topingSchema');

// const Topping = require('../model/toppingSchema');


router.get('/', (req, res) => {
    res.send(`Hello world from server`);
})

router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message:req.body})

    // for testing
    // console.log(req.body.name);
    // console.log(req.body.email);

    const { name, email, phone, password, cpassword } = req.body;

    console.log(req.body);

    //  for validation purpose - if empty feild then error throw
    if (!name || !email || !phone || !password || !cpassword) {

        return res.status(422).json({ error: "please filled properly feild ." });

    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "user is already exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password are not same" });

        } else {


            const user = new User({ name, email, phone, password, cpassword });

            //if user is new then we save attribute , but before save we have to encrypt password feild using bcrypt.js
            // presave method

            await user.save();

            res.status(201).json({ message: "user registerd successfully" });
        }


    } catch (err) {
        console.log(err);
    }



})

router.post('/sign', async (req, res) => {
    const { name, email, phone, password, cpassword, type, secretKey, shopID } = req.body;
    console.log(req.body);

    // Validate input fields
    if (!name || !email || !phone || !password || !cpassword || !type) {
        return res.status(422).json({ error: "Please fill in all required fields." });
    }

    try {
        // Check if user already exists
        const userExist = await Userss.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "User already exists." });
        }

        // Check if password and confirm password match
        else if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match." });
        }

        if (type === 'admin') {
            if (secretKey !== 'admin') {
                return res.status(403).json({ error: "Invalid secret key for admin registration." });
            }
        }

        // Create a new user
        const user = new Userss({ name, email, phone, password, cpassword, type, secretKey, shopID });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});






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

                // res.status(201).json({ message: "user login successfully" });
            }


        } else {

            res.status(400).json({ error: "Invalid Credentials...   " });

        }

    } catch (err) {

        console.log(err);

    }
})



router.post('/addtocart', Authenticate, async (req, res) => {
    try {

        if(req.status === 401){
            // return res.status(401)
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
        console.log("selectedSize",selectedSize);


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




router.post('/order', Authenticate, async (req, res) => {
    try {
        const userId = req.rootUser._id;

        // Find the user's cart
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
            totalAmount: totalAmount,
            orderStatus: 'Pending',
            paymentStatus: 'Pending'
        });

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

        // Remove items from the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/getpizza', async (req, res) => {
    try {
        const pizzas = await PizzaMenuItem.find({});
        // const pizzas = await Pizza.find({});
        res.json(pizzas);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/getcart', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:",userId)
        const userEmail = req.rootUser.email;
        console.log("email:",userEmail)

        const carts = await Cart.findOne({userID:userId});
        // const pizzas = await Pizza.find({});
        res.json(carts);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/addItem', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:",userId)
        const userEmail = req.rootUser.email;
        console.log("email:",userEmail)

        const { itemName, description, sizes,  image } = req.body;

        const admin = await Userss.findOne({ email: userEmail });
        // const admin = await Userss.findOne({ userID: userId });
        console.log("admina:",admin);
        if (!admin || admin.type !== 'admin') {
            return res.status(404).json({ error: 'Admin not found' });
        }


        const newItem = new PizzaMenuItem({
            shopID:admin.shopID,
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

// Define the DELETE route for deleting a pizza menu item by ID
router.delete('/deleteItems/:itemId',Authenticate, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and delete the pizza menu item by ID
        const deletedItem = await PizzaMenuItem.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Pizza menu item not found' });
        }

        // Item deleted successfully
        res.status(200).json({ message: 'Pizza menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza menu item:', error);
        res.status(500).json({ message: 'Failed to delete pizza menu item' });
    }
});

router.put('/updateItems/:itemId', Authenticate,async (req, res) => {
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



// Define the DELETE route for deleting a topping by ID
router.delete('/deleteTopping/:itemId',Authenticate, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Find and delete the topping by ID
        const deletedTopping = await Toping.findByIdAndDelete(itemId);

        if (!deletedTopping) {
            return res.status(404).json({ message: 'Topping not found' });
        }

        // Topping deleted successfully
        res.status(200).json({ message: 'Topping deleted successfully' });
    } catch (error) {
        console.error('Error deleting topping:', error);
        res.status(500).json({ message: 'Failed to delete topping' });
    }
});

// Define the PUT route for updating a topping by ID
router.put('/updateToppings/:itemId',Authenticate, async (req, res) => {
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

// Route handler for getting pizza items with pagination
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
router.get('/getItemsss',Authenticate, async (req, res) => {
    try {
        const TopingItems = await Toping.find();

        res.status(200).json(TopingItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add a new topping
router.post('/addTopping', Authenticate, async (req, res) => {
    try {

        const userId = req.rootUser._id;
        console.log("user:", userId)
        const userEmail = req.rootUser.email;
        console.log("email:", userEmail)

        const { toppingName, price } = req.body;

        const admin = await Userss.findOne({ email: userEmail });
        // const admin = await Userss.findOne({ userID: userId });
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

router.get('/Cart', Authenticate, (req, res) => {
    console.log(`Hello my About`);
    res.send(req.rootUser);
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

module.exports = router;