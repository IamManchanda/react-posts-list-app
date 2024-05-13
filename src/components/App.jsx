import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import ResponsivePagination from 'react-responsive-pagination';
import PostDetailsContainer from './PostDetailsContainer';
import { CONFIG } from '../constants/config';
import 'react-responsive-pagination/themes/minimal.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.API_URL}/posts?_page=${currentPage}&_limit=${CONFIG.ITEMS_PER_PAGE}`
        );
        setPosts(response.data);
        setTotalCount(parseInt(response.headers.get('X-Total-Count'), 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const memoizedHeavyComputation = useMemo(() => (item) => {
    const result = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
          body: item.body.charAt(0).toUpperCase() + item.body.slice(1),
        });
      }, 1000);
    });
    return result;
  }, []);

  if (loading) {
    return <div className="app">
      <h1>Loading...</h1>
    </div>;
  }
  
  if (error) {
    return <div className="app">
      <h1>Error: {error}</h1>
    </div>;
  }

  return (
    <div className="app">
      <h1>Posts</h1>
      <ul className='post-list-wrapper'>
        {posts.map(item => (
          <PostDetailsContainer
            key={item.id}
            item={item}
            compute={memoizedHeavyComputation}
          />
        ))}
      </ul>
      <ResponsivePagination
        total={Math.ceil(totalCount / CONFIG.ITEMS_PER_PAGE)}
        current={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default App;
