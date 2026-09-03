const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./MODELS/user");

mongoose.connect("mongodb://127.0.0.1:27017/studentskillexchange")
  .then(async () => {
    console.log("MongoDB connected");

    const newPassword = "Khushi@123";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: "khushi@gmail.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("Khushi user not found");
    } else {
      console.log("✅ Khushi password reset successfully");
      console.log("New password:", newPassword);
    }

    await mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
