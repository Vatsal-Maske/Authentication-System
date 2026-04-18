import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";

import { generateOTP, getOTPhtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


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

    const otp = generateOTP();

    const html = getOTPhtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })


    await sendEmail(email, "Your OTP for email verification", "Please verify your email", html);


    // const refreshToken = jwt.sign({
    //     id: user._id
    // }, config.JWT_SECRET, {
    //     expiresIn: "7D"
    // }
    // )

    // const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    //  const session = await sessionModel.create({
    //     user:user._id,
    //     refreshTokenHash,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"] 
    //  })

    // const accesstoken = jwt.sign({
    //     id: user._id,
    //     sessionId: session._id
    // }, config.JWT_SECRET,
    //     {
    //         expiresIn: "15m"
    //     })





    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000
    // })


    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified

        },
        // accesstoken

    })
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    if(!user.verified){
        return res.status(401).json({
            message: "Please verify your email before logging in"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7D"
    }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accesstoken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email
        },
        accesstoken
    })



}

export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    console.log(decoded);



    const user = await userModel.findById(decoded.id);

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })

}


export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }


    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(401).json({
            message: "Session not found"
        })
    }

    const user = await userModel.findById(decoded.id)
    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }

    const accesstoken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        })

    const newRefreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7D"
    }
    )

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;

    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Access token refreshed successfully",
        accesstoken
    })
    // const user = await userModel.findById(decoded.id)
}


export async function logout(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }


    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    });

    if (!session) {
        return res.status(400).json({
            message: "Session not found"
        })
    }

    session.revoked = true;

    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logged out successfully"
    })

}


export async function logoutAll(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);




    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })
}


export async function verifyEmail(req, res) {
    const { otp, email } = req.body;


    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{
        verified:true
    });

    await otpModel.deleteMany({
        user :otpDoc.user
    })

    return res.status(200).json({
        message: "Email verified successfully"
    }
)

}