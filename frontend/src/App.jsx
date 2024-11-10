import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [dt, setDt] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the index of the displayed joke
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const cachedData = localStorage.getItem('cachedJokes');
  //   if (cachedData) {
  //     setDt(JSON.parse(cachedData));
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:4000/post');
  //     setDt(response.data);
  //     setError(null);
  //     localStorage.setItem('cachedJokes', JSON.stringify(response.data));
  //   } catch (err) {
  //     console.error('Error fetching data:', err);
  //     setError('Unable to fetch new data. Showing cached data if available.');
  //     if (dt.length === 0) {
  //       setError('No data available. Please check your connection and try again.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleNextJoke = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % dt.length);
  // };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center p-4">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      fetchData(); // Refresh data when coming back online
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError('You are currently offline. Showing cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      const cachedData = localStorage.getItem('cachedJokes');
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDt(parsedData);
        setLoading(false);
      }

      if (navigator.onLine) {
        await fetchData();
      } else {
        setError('You are offline. Showing cached data.');
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/post', {
        timeout: 5000 // 5 second timeout
      });
      
      if (response.data && response.data.length > 0) {
        setDt(response.data);
        localStorage.setItem('cachedJokes', JSON.stringify(response.data));
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      const cachedData = localStorage.getItem('cachedJokes');
      
      if (cachedData && dt.length === 0) {
        setDt(JSON.parse(cachedData));
        setError('Unable to fetch new data. Showing cached data.');
      } else if (!cachedData && dt.length === 0) {
        setError('No data available. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextJoke = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dt.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-4">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          {error}
        </div>
      )}

      {dt.length > 0 ? (
        <div className="container">
          <h2 className="text-xl font-bold">{dt[currentIndex].title}</h2>
          <p className="mt-2">{dt[currentIndex].body}</p>
        </div>
      ) : (
        <div className="text-center p-4">
          <p>No data available</p>
        </div>
      )}

      <button onClick={handleNextJoke} className="btn" id="jokeBtn">
        Next joke 😂😂
      </button>
    </div>
  );
}
