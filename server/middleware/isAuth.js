import jwt from "jsonwebtoken"
const isAuth = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    let { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ message: "token is not stored" });
    }
    //verify token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(400).json({ message: "token is not verified" });
    }
    console.log("Decoded Token:", verifyToken);

    req.userId = verifyToken.userId;

    console.log("req.userId:", req.userId);

    next();
  } catch (error) {
    res.status(400).json({ message: `isAuth error ${error}` });
  }
};

export default isAuth;
