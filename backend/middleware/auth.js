// Middleware to extract Bearer token from Authorization header
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  req.token = authHeader.split(" ")[1];
  next();
};

export default authMiddleware;
