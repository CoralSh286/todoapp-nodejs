/** @format */

const express = require("express"),
  router = express.Router(),
  service = require("../BL/users.service");
router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    res.send(await service.getUser(username));
  } catch (error) {
    res.status(400).send(error.message || "Error fetching user");
  }
});
router.post("/register", async (req, res) => {
  try {
    const data = await service.createUser(req.body);
    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      street: data.street,
      city: data.city,
      company_name: data.company_name,
    };
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message || "Error creating user");
  }
});
router.put("/login", async (req, res) => {
  try {
    const data = await service.login(req.body);
    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      street: data.street,
      city: data.city,
      company_name: data.company_name,
    };
    if (data) {
      res.send({
        success: true,
        message: "Login successful",
        isLogin: true,
        user: user,
      });
    }
  } catch (error) {
    res.send( {
        success: false,
        message: error.message ,
        isLogin: false,
      })
  }
  
});

module.exports = router;
