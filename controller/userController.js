const { default: mongoose } = require("mongoose");
const User = require("../models/userModel")
const { StatusCodes } = require('http-status-codes');


const getUser = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const data = await User.find()
            .skip(skip)
            .limit(limit);

        return res.status(StatusCodes.OK).send({
            success: true,
            message: 'user data fetched sucess fully',
            data
        })

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'error'
        })
    }
}


const createUser = async (req, res) => {

    try {
        // Validation
        const { name, email, password, age, phone } = req.body;

        if (!name || !email || !phone || !password || !age) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Please provide all required fields.",
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'User with this email already exists.'
            });
        }

        // Create new user
        const user = await User.create(...[req.body]);
        res.status(StatusCodes.CREATED).send({
            success: true,
            message: "Successfully Registered",
            user
        });

    } catch (err) {
        console.error('Error creating user:', err);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'An internal server error occurred. Please try again later.'
        });
    }
}

// get user by id 

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid user id" });
        }
        res.json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }

}

// update user

const updateUser = async (req, res) => {
    try {
        const { name, email, age, phone, password } = req.body
        if (!name || !email || !age || !phone || !password) {
            return res.send("all fields are requird");
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}



// delete user

const deleteUser = async (req, res) => {
    try {

        const id = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "please enter valid id!" })

        }



        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "please enter user id!" })
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found or enter valid userid' });
        }
        return res.status(StatusCodes.OK).json({ message: "user data deleted!" })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "unable to delete data" })
    }
}


module.exports = { getUser, createUser, getUserById, updateUser, deleteUser }