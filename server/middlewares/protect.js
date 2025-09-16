import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token has invalid format"
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token has invalid format"
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, "your-secret-key");
      req.user = decoded; // Add user info to request object
      next();
    } catch (verifyError) {
      return res.status(401).json({
        message: "Token is invalid"
      });
    }

  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({
      message: "Token has invalid format"
    });
  }
};

export default protect;
