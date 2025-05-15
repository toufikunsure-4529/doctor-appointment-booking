import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const dToken = req.headers["d-token"];
    if (!dToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - token missing",
      });
    }

    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
    req.user = { docId: token_decode.id };
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export default authDoctor;