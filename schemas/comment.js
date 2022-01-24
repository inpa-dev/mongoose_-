const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema; // ObjectId 타입은 따로 꺼내주어야 한다.
const commentSchema = new Schema({
  commenter: {
    type: ObjectId, // 몽고디비에서 ObjectId타입으로 데이터를 다룸
    required: true,
    ref: 'User', // user.js스키마에 reference로 연결되어 있음. join같은 기능. 나중에 populate에 사용
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
