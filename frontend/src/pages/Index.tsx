import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Home page
    navigate('/');
  }, [navigate]);

  return null; // No need to render anything as we're redirecting
};

export default Index;
