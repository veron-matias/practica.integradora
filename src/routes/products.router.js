const express = require("express");
const router = express.Router();
const ProductManagerDb = require("../controller/productManagerDb");
const productManagerDb = new ProductManagerDb();

router.use(express.static("./src/public"));

router.get("/view", async (req, res) => {
  try {
    if (!req.session.login) {
      return res.redirect("/auth/login");
    }
    const products = await productManagerDb.getProducts(req.query);
    res.render("products", {
      products,
      active: { products: true },
      user: req.session.user,
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    if (!req.session.login) {
      return res.redirect("/auth/login");
    }
    const product = await productManagerDb.getProductById(req.params.id);
    res.render("product", { product });
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productManagerDb.getProducts(req.query);
    res.status(201).json(products);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManagerDb.getProductById(req.params.pid);
    product ? res.json(product) : res.json({ error: "Product not found" });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    await productManagerDb.deleteProduct(req.params.pid);
    res.status(200).json({ message: `Product with id ${req.params.pid} deleted` });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await productManagerDb.addProduct(req.body);
    res.status(201).json({ response });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    await productManagerDb.updateProduct(req.params.pid, req.body);
    res.status(201).json({ message: `Product with id ${req.params.pid} updated` });
  } catch (err) {
    handleError(res, err);
  }
});

function handleError(res, err) {
  res.status(500).json({ error: err });
}

module.exports = router;