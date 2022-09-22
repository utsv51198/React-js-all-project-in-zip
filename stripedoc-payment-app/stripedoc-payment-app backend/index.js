const cors = require("cors");
const express = require("express");
// TODO : add stripe key
const stripe = require("stripe")(
  "sk_test_51KVDzxLqP6NVVgd3B36hRXH6VAoguM9CataWEDApRvXP7VkYEkoZsnNSqhYsBs82htAkRpouRqeeY8Uqqof2qDye00zflUtIhS"
);

const uuid = require("uuid").v4;

const app = express();

//middlewares

app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("IT WAS WORK AT PEAFOWLSOFT");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Products", product);
  console.log("Price", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 1000,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});
//listen

app.listen(8282, () => console.log("LISTENING AT PORT 8282"));
