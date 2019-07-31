import uuid from 'uuid/v4';

const createComment = (parent, { data }, { pubsub, db }, info) => {
  const existingUserAndPost =
    db.users.some(user => user.id === data.author) &&
    db.posts.some(post => post.id === data.post && post.published);
  if (!existingUserAndPost) {
    throw new Error("User or post doesn't exist.");
  }
  const newComment = {
    id: uuid(),
    ...data
  };
  db.comments.push(newComment);
  pubsub.publish(`comment: ${data.post}`, { comment: newComment });
  return newComment;
};

const deleteComment = (parent, { id }, { db }, info) => {
  const commentId = db.comments.findIndex(comment => comment.id === id);
  if (commentId === -1) {
    throw new Error("Comment doesn't exist.");
  }
  const deletedComment = db.comments.splice(commentId, 1);
  return deletedComment[0];
};

const updateComment = (parent, { id, data }, { db }, info) => {
  const comment = db.comments.find(comment => comment.id === id);
  if (!comment) {
    throw new Error("Comment doesn't exist.");
  }
  if (typeof data.body === 'string') {
    comment.body = data.body;
  }
  return comment;
};

export { createComment, deleteComment, updateComment };