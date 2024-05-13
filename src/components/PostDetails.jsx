/* eslint-disable react/prop-types */
import { useEffect, memo } from 'react';

const PostDetails = memo(({ post }) => {
  useEffect(() => {
    console.log('PostDetails component re-rendered due to post prop change.');
  }, [post]);

  return (
    <div className="post-details">
      <h2>Post Details</h2>
      <p>ID: {post.id}</p>
      <p>Title: {post.title}</p>
      <p>Body: {post.body}</p>
    </div>
  );
});

PostDetails.displayName = 'PostDetails';

export default PostDetails;
