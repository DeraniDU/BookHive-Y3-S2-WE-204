// // controllers/userController.js
// import User from "../models/UserModel.js";

// // Save user profile when login/signup
// export const saveUserProfile = async (firebaseUser) => {
//   try {
//     const existingUser = await User.findOne({ uid: firebaseUser.uid });

//     if (!existingUser) {
//       // If user not found, create new user document
//       const newUser = new User({
//         uid: firebaseUser.uid,
//         displayName: firebaseUser.displayName || "Anonymous",
//         email: firebaseUser.email,
//         photoURL: firebaseUser.photoURL,
//       });

//       await newUser.save();
//       console.log(`✅ New user profile saved: ${firebaseUser.uid}`);
//     } else {
//       console.log("✅ User already exists in database");
//     }
//   } catch (error) {
//     console.error("Error saving user profile:", error);
//   }
// };
