const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, phoneNumber, address, country, zipCode, city, state, isAdmin) => {
  return jwt.sign(
    {_id, name, lastName, email, phoneNumber, address, country, zipCode, city, state, isAdmin},
    process.env.JWT_SECRET_KEY,
    {expiresIn: "12h"}
  );
};

module.exports = generateAuthToken;