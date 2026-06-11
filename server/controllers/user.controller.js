import User from "../models/userModel.js"

export const getCurrentUser = async (req, res) => {
  try {
    console.log("Inside currentUser");

    const userId = req.userId;
    console.log("userId:", userId);

    const user = await User.findById(userId);
    console.log("user:", user);

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log("CurrentUser Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};