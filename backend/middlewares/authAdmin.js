import jwt from "jsonwebtoken";

// Admin authentication middlewares
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res
        .status(401)
        .json({ success: "false", message: "Unauthorized" }); // check if token is provided then unauthorized access res send
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET); // decode token

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res
        .status(401)
        .json({ success: "false", message: "Unauthorized" });
    }
    next(); // if token is valid then call next middleware
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "false",
      message: `Internal Server Error : ${error.message}`,
    });
  }
};

export default authAdmin;
