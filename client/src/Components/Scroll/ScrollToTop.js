import { useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

function ScrollToTop() {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const onRouteChange = () => {
        window.scrollTo(0, 0);
      };
  
      // Scroll to the top on route change
      onRouteChange();
  
      // Clean up the scroll effect when the component unmounts
      return () => {
        window.removeEventListener('scroll', onRouteChange);
      };
    }, [location]);
  
    return null;
  }

export default ScrollToTop;
