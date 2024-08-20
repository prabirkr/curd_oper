const { body, validationResult } = require('express-validator');
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
        try {
            const {email,password } = req.body;
            // Check user
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(400).send({
                    success: false,
                    message: "Email Already Registered. Please Login",
                });
            }

            // Hashing password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = await User.create({
                ...req.body,
                password: hashedPassword,
                
            })

            res.status(201).send({
                success: true,
                message: "Successfully Registered",
                user,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In Register API",
                error,
            });
        }
    };

// LOGIN
const login = async (req, res) => {
        try {
          
            const { email, password } = req.body;

            // Check user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User Not Found",
                });
            }

            // Check user password | Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid Credentials",
                });
            }

            console.log({ JWT_SECRET: process.env.JWT_SECRET, refersh: process.env.JWT_REFRESH_SECRET })

            // Generate tokens
            const accessToken = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "445s",
            });
            const refreshToken = JWT.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
                expiresIn: "60s",
            });

            const accessTokenPayload = JWT.decode(accessToken);
            const refreshTokenPayload = JWT.decode(refreshToken);

            user.password = undefined;
            res.status(200).send({
                success: true,
                message: "Login Successfully",
                accessToken,
                refreshToken,
                accessTokenExpiresAt: accessTokenPayload.exp,
                refreshTokenExpiresAt: refreshTokenPayload.exp,
                accessTokenExpiresAt: accessTokenPayload.exp,
                refreshTokenExpiresAt: refreshTokenPayload.exp,
                user,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error In Login API",
                error,
            });
        }
    };

module.exports = { register, login };
