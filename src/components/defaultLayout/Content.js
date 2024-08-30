import About from '../../pages/About';
import AboutFindMeHere from '../../pages/AboutFindMeHere';
import Account from '../../pages/Account';
import Contact from '../../pages/Contact';
import Home from '../../pages/Home';
import Privacy from '../../pages/Privacy';
import Signup from '../Signup';
import TermsOfService from '../../pages/TermsOfService';
import { useLocation } from 'react-router-dom';

const Content = () => {
  const { pathname } = useLocation();

  let Page;
  switch (pathname) {
    case '/about':
      Page = <About />;
      break;
    case '/about_find_me_here':
      Page = <AboutFindMeHere />;
      break;
    case '/privacy':
      Page = <Privacy />;
      break;
    case '/terms':
      Page = <TermsOfService />;
      break;
    case '/contact':
      Page = <Contact />;
      break;
    case '/login':
      Page = <Signup />;
      break;
    case '/my-account':
      Page = <Account />;
      break;
    default:
      Page = <Home />;
      break;
  }

  return <div className="overflow-auto">{Page}</div>;
};

export default Content;
