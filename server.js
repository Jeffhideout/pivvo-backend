require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payments");

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/payments", paymentRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is alive");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});