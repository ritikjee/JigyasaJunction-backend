import { Request, Response } from "express";
import User from "../models/user.model";
import UUser from "../models/unverifoeduser.model";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function login(req: Request, res: Response) {
  if (!process.env.JWT_SECRET_KEY) {
    console.log("JWT_SECRET not found");
    process.exit(1);
  }

  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Email/Username and password are required" });
  }
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      if (
        (await UUser.findOne({ email: identifier })) ||
        (await UUser.findOne({ username: identifier }))
      ) {
        return res.status(401).json({ message: "Account not verified" });
      }
      return res.status(404).json({ message: "User not found" });
    }

    const verifiedpassword = await bcryptjs.compare(password, user.password);
    if (!verifiedpassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY!
    );

    return res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, name, bio, username } = req.body;
  if (!email || !password || !name || !username) {
    return res
      .status(400)
      .json({ message: "Email, password, name and username are required" });
  }
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const unverifieduser = await UUser.findOne({
      $or: [{ email }, { username }],
    });
    if (unverifieduser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedpassword = await bcryptjs.hash(password, 10);
    const newuser = new UUser({
      email,
      password: hashedpassword,
      name,
      bio,
      username,
    });
    await newuser.save();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_MAIL_ID,
        pass: process.env.NEXT_PUBLIC_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_MAIL_ID,
      to: email,
      subject: "Hello from Shiva this side",
      text:
        "Hello " +
        name +
        " Thanks for Registering with us  the form!," +
        "I will get back to you soon " +
        `http://localhost:8000/verify?email=${email}&token=${newuser.token}`,
    };
    transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function verify(req: Request, res: Response) {
  const { email, token } = req.query;
  try {
    const user = await UUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.token === token) {
      const newUser = await User.create({
        name: user.name,
        username: user.username,
        bio: user.bio,
        password: user.password,
        email: user.email,
      });
      await UUser.deleteOne({ email: user.email });
      return res
        .status(201)
        .json({ message: "Your account created successfully" });
    }
    return res.status(400).json({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserDetails(req: Request, res: Response) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const jwtToken = token.split(" ")[1];
  try {
    var decoded: any = undefined;
    try {
      decoded = jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET!);
    } catch (error) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Unauthorized" });
    }
    return res
      .status(200)
      .json({ userid: user?._id, username: user?.username, name: user?.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
