import { Link } from 'react-router-dom';

const HEADER_HEIGHT = 84; // px

const Header: React.FC = () => (
  <header
    className="fixed top-0 left-0 w-full bg-green-600 shadow-lg z-50"
    style={{ height: HEADER_HEIGHT }}
  >
    <div
      className="flex items-center"
      style={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, paddingLeft: '24px' }}
    >
      <Link
        to="/"
        className="text-3xl font-bold text-white no-underline transition-opacity duration-200 hover:opacity-80 cursor-pointer"
        style={{ lineHeight: 1 }}
      >
        よるさんぽナビ
      </Link>
    </div>
  </header>
);

export default Header;
