import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { allMessages, sendMessage } from '../controllers/message.controller.js';
import multer from 'multer';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.route('/:chatId').get(protectRoute, allMessages);
router.route('/').post(protectRoute, upload.single('image'), sendMessage);

export default router;
