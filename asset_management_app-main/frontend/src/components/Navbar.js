import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <span
          onClick={handleOnClick}
          className="text-2xl font-bold text-white cursor-pointer"
        >
          Asset Management App
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
