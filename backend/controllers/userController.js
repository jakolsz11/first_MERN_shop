const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").orFail();
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password, phoneNumber, country, city, street, homeNumber, localNumber, zipCode } = req.body;
    if (!name || !lastName || !email || !phoneNumber || !country || !city || !street || !homeNumber || !zipCode || !password) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).send("user exists");
    }
    else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name: name,
        lastName: lastName,
        email: email.toLowerCase(),
        phoneNumber: phoneNumber,
        country: country,
        city: city,
        street: street,
        homeNumber: homeNumber,
        localNumber: localNumber,
        zipCode: zipCode,
        password: hashedPassword,
      });

      return res.cookie(
        "access_token",
        generateAuthToken(
          user._id,
          user.name,
          user.lastName,
          user.email,
          user.phoneNumber,
          user.country,
          user.city,
          user.zipCode,
          user.street,
          user.homeNumber,
          user.localNumber,
          user.isAdmin
        ),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        }
      ).status(201).json({
        success: "User created",
        userCreated: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          street: user.street,
          country: user.country,
          zipCode: user.zipCode,
          city: user.city,
          homeNumber: user.homeNumber,
          localNumber: user.localNumber,
          isAdmin: user.isAdmin
        }
      });
    }

  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    if (!email || !password) {
      return res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({email: email});
    if (user && comparePasswords(password, user.password)) {

      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      };

      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
      };

      return res.cookie(
        "access_token",
        generateAuthToken(
          user._id,
          user.name,
          user.lastName,
          user.email,
          user.phoneNumber,
          user.address,
          user.country,
          user.zipCode,
          user.city,
          user.state,
          user.isAdmin
        ),
        cookieParams
      ).status(201).json({
        success: "user logged in",
        userLoggedIn: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          street: user.street,
          country: user.country,
          zipCode: user.zipCode,
          city: user.city,
          homeNumber: user.homeNumber,
          localNumber: user.localNumber,
          isAdmin: user.isAdmin,
          doNotLogout: doNotLogout
        }
      });
    }
    else {
      return res.status(401).send("wrong credentials");
    }

  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.street = req.body.street || user.street;
    user.country = req.body.country || user.country;
    user.zipCode = req.body.zipCode || user.zipCode;
    user.city = req.body.city || user.city;
    user.homeNumber = req.body.homeNumber || user.homeNumber;
    user.localNumber = req.body.localNumber;
    if (!comparePasswords(req.body.password, user.password)) {
      user.password = hashPassword(req.body.password);
    }

    await user.save();

    return res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        street: user.street,
        country: user.country,
        zipCode: user.zipCode,
        city: user.city,
        homeNumber: user.homeNumber,
        localNumber: user.localNumber,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  }catch(error){
    next(error);
  }
};

const writeReview = async (req, res, next) => {
  try{
    const session = await Review.startSession();

    const { comment, rating } = req.body;

    if(!comment || !rating){
      return res.status(400).send("All inputs are required");
    }

    const ObjectId = require("mongodb").ObjectId;
    let reviewId = ObjectId();

    session.startTransaction();
    await Review.create([
      {
        _id: reviewId,
        comment: comment,
        rating: Number(rating),
        user: {
          _id: req.user._id,
          name: req.user.name + " " + req.user.lastName
        }
      }
    ], {session: session});

    const product = await Product.findById(req.params.productId).populate("reviews").session(session);

    const alreadyReviewed = product.reviews.find((review) => review.user._id.toString() === req.user._id.toString());
    if(alreadyReviewed){
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("product already reviewed");
    }

    let prc = [ ...product.reviews ];
    prc.push({rating: rating});
    product.reviews.push(reviewId);

    if(product.reviews.length === 1){
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    }
    else{
      product.reviewsNumber = product.reviews.length;
      let ratingCalc = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;
      product.rating = Math.round(ratingCalc);
    }

    await product.save();

    await session.commitTransaction();
    session.endSession();
    res.send("review created");

  }catch(error){
    await session.abortTransaction();
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
    return res.send(user);
  }catch(error){
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id).orFail();

    user.name = req.body.name || user.name;
    user.lastName =  req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    await user.save();

    return res.send("user updated");

  }catch(error){
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id).orFail();
    await user.remove();
    return res.send("user removed");
  }catch(error){
    next(error);
  }
}

module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser };