import { useRef, useEffect } from 'react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import LoadingSpinner from './LoadingSpinner';

const InfiniteScroll = ({ children, fetchMore, hasMore, threshold = 100 }) => {
  const { isLoading } = useInfiniteScroll(fetchMore, hasMore, threshold);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, isLoading, threshold]);

  return (
    <>
      {children}
      <div ref={loaderRef} className="py-4 flex justify-center">
        {isLoading && <LoadingSpinner />}
        {!hasMore && (
          <p className="text-sm text-gray-400">You've reached the end!</p>
        )}
      </div>
    </>
  );
};

export default InfiniteScroll;