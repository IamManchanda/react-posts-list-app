/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CONFIG } from '../constants/config';
import PostDetails from './PostDetails';

const PostDetailsContainer = ({ item, compute }) => {
  const [result, setResult] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [postDetails, setPostDetails] = useState(null);

  useEffect(() => {
    const startTime = performance.now();
    compute(item).then(setResult);
    const endTime = performance.now();

    console.log(`Heavy computation for "${item.title}" took ${endTime - startTime} ms.`);
  }, [item, compute]);

  const fetchPostDetails = useCallback(async (id) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  }, []);

  const toggleDetails = async () => {
    if (!postDetails) {
      setLoadingDetails(true);
      const details = await fetchPostDetails(item.id);
      setPostDetails({
        ...details,
        title: result.title,
        body: result.body,
      });
    }
    setShowDetails(!showDetails);
    setLoadingDetails(false);
  };

  if (!result) {
    return (
      <li>
        <h2>Loading...</h2>
      </li>
    );
  }

  return (
    <li>
      <h2>{result.title}</h2>
      <p>{result.body}</p>
      <button onClick={toggleDetails} disabled={loadingDetails}>
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>
      {showDetails && <PostDetails post={postDetails} />}
    </li>
  );
};


export default PostDetailsContainer;

