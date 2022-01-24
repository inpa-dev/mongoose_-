const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

// axios.post('/comments', { id, comment }); 로부터 요청 받음
router.post('/', async (req, res, next) => {
  try {
    const comment = await Comment.insertMany({ // insert
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);

    // 위의 comment 쿼리결과의 commenter필드에 populate해서, 
    // objectid인 필드값을 실제 user 임베디드 다큐먼트로 바꿔준다.
    const result = await Comment.populate(comment, { path: 'commenter' });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  // axios.patch(`/comments/${comment._id}`, { comment: newComment }); 로부터 요청 받음
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update({
        _id: req.params.id, // 업데이트 대상 검색
      }, {
        comment: req.body.comment, // 업데이트 내용. 원래는 $set해줘야 되지만 몽구스는 알아서 보호가 된다.
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // axios.delete(`/comments/${comment._id}`);로부터 요청 받음
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
