const express = require("express");
const router = express.Router();
const CartManagerDb = require("../controller/cartManagerDb");
const cartManagerDb = new CartManagerDb();

router.use(express.static("./src/public"));

router.get("/view", async (req, res) => {
  if (!req.session.login) {
    return res.redirect("/auth/login");
  }

  try {
    const newCart = await cartManagerDb.getCartById("cid");
    res.render("cart", {
      cart: JSON.stringify(newCart),
      active: { cart: true },
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManagerDb.createCart();
    res.json({ message: `Cart created with id ${newCart._id}` });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManagerDb.getCartById(cid);
    cart ? res.status(200).json(cart) : res.status(404).json({ message: `Cart with id ${cid} not found` });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity;
    cid && pid ? res.status(200).json({ message: await cartManagerDb.addToCart(cid, pid, quantity) }) : null;
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    cid && pid ? res.status(200).json({ message: await cartManagerDb.deleteFromCart(cid, pid) }) : null;
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:cid/", async (req, res) => {
  try {
    const { cid } = req.params;
    cid ? res.status(200).json({ message: await cartManagerDb.deleteAllProductsFromCart(cid) }) : null;
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    cid ? res.status(200).json({ message: await cartManagerDb.addProductsToCart(cid, req.body) }) : null;
  } catch (err) {
    handleError(res, err);
  }
});

function handleError(res, err) {
  console.log("err:", err);
  res.status(500).json({ message: "Server problems" });
}

module.exports = router;