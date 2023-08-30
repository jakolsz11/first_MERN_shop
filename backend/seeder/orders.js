const ObjectId = require("mongodb").ObjectId;

const orders = Array.from({ length: 22 }).map((_, idx) => {
  let day = 20;
  if(idx<10){
    var hour = "0" + idx;
    var subtotal = 100;
  }
  else if(idx> 18 && idx<23){
    var hour = idx;
    var subtotal = 100 + 7 * idx;
  }
  else{
    var hour = idx;
    var subtotal = 220;
  }

  return {
    user: ObjectId("64a99a6645b2417dba018214"),
    orderTotal: {
      itemsCount: 5,
      cartSubtotal: subtotal,
    },
    cartItems: [
      {
        name: "Product name",
        price: 14,
        image: {path: "/images/carousel_1.jpeg"},
        quantity: 5,
        count: 15,
      },
    ],
    paymentMethod: "pp",
    isPaid: false,
    isDelivered: false,
    createdAt: `2023-08-${day}T${hour}:19:32.490+00:00`,
  }
});

module.exports = orders;