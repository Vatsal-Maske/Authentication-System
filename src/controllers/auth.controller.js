import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";



export async function register(req, res) {


    const { username, email, password } = req.body;

    const isAreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })


    if (isAreadyRegistered) {
        return res.status(409).json({
            message: "User already registered"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "1d"
        })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email

        },
        token
    })
}

export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    console.log(decoded);



    const user = await userModel.findById(decoded.id);

   res.status(200).json({
    message: "User fetched successfully",
    user:{
        username: user.username,
        email: user.email
    }
   })

}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "1d"
        });

    res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email
        },
        token
    });
}