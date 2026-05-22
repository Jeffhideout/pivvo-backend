const express = require("express");
const axios = require("axios");

const router = express.Router();

// TEST ROUTE (to confirm routing works)
router.get("/test", (req, res) => {
  res.json({ message: "Payments route working" });
});

// CREATE PAYMENT (Flutterwave)
router.post("/create-payment", async (req, res) => {
  try {
    const { amount, email } = req.body;

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: Date.now().toString(),
        amount: amount,
        currency: "KES",
        redirect_url: "https://brown-animals-occur.loca.lt",
        customer: {
          email: email,
        },
        customizations: {
          title: "Pivvo Payment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      message: "Payment creation failed",
    });
  }
});

// VERIFY PAYMENT
router.get("/verify/:transaction_id", async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Verification failed",
    });
  }
});

module.exports = router;