const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;

const users = [
  {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    phoneNumber: "123456789",
    street: "default street",
    country: "default country",
    zipCode: "12-123",
    city: "default city",
    homeNumber: 123,
    password: bcrypt.hashSync('admin@admin.com', 10),
    isAdmin: true,
  },
  {
    _id: ObjectId("64a99a6645b2417dba018214"),
    name: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    phoneNumber: "123456789",
    street: "default street",
    country: "default country",
    zipCode: "12-123",
    city: "default city",
    homeNumber: 123,
    password: bcrypt.hashSync('john@doe.com', 10),
  },
]

module.exports = users;