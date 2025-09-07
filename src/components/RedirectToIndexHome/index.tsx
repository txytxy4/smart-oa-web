import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToIndexHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/index/home', { replace: true });
  }, [navigate]);

  return null;
};

export default RedirectToIndexHome;
