import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: String,
  contactInfo: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  location: String,
  booksOwned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  requestsMade: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookRequest'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;