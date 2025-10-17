import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/yt_icon.png";
import { IoIosSearch } from "react-icons/io";
import { AiFillAudio } from "react-icons/ai";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import Profile from "../components/Profile";
import DisplayVideosInHomePage from "../components/DisplayVideosInHomePage";
import DisplayShortsInHomePage from "../components/DisplayShortsInHomePage";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { loggedInUserData } = useUserStore();

  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home"); // for desktop
  const [activeItem, setActiveItem] = useState("Home"); // for mobile

  // Toggling profile state
  const [toggle, setToggle] = useState(false);

  // categories to be displayed on the home screen
  const categories = [
    "Music",
    "Gaming",
    "News",
    "Entertainment",
    "Sports",
    "Movies",
    "Live",
    "DSA",
    "Science & Tech",
    "TV Shows",
    "Art",
    "Comedy",
    "Vlogs",
    "Education",
    "Gadgets",
    "Health",
    "Horror",
    "Cooking",
    "Dance",
    "Fashion",
  ];
  return (
    <div className="bg-[#0f0f0f] min-h-screen relative text-white">
      {/* Navbar */}
      <header className="h-15 p-4 border-b-1 flex items-center border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full">
          {/* left section */}
          <div className="flex items-center gap-5">
            <button
              className="hidden md:flex text-xl bg-[#272727] p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out"
              onClick={() => setSideBarOpen(!sideBarOpen)}
            >
              <RxHamburgerMenu color="white" size={20} />
            </button>
            <div className="flex items-center">
              <img src={logo} alt="" className="w-10" />
              <span className="font-roboto text-2xl tracking-tighter ">
                YouTube
              </span>
            </div>
          </div>

          {/* middle section */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1 items-center">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700"
              />
              <button className="bg-[#272727] p-2 rounded-r-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out border border-gray-700">
                <IoIosSearch size={24} />
              </button>
            </div>
            <button className="bg-[#272727] p-2 rounded-full cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out">
              <AiFillAudio size={23} />
            </button>
          </div>

          {/* right section */}
          <div className="flex items-center gap-3">
            {loggedInUserData?.channel && (
              <button
                onClick={() => navigate("/create-content")}
                className="bg-[#272727] rounded-full cursor-pointer hidden px-4 py-1 md:flex gap-1 hover:bg-zinc-700 transition duration-300 ease-in-out items-center"
              >
                <span className="text-xl">+</span>
                <span className="text-sm">Create</span>
              </button>
            )}
            {loggedInUserData ? (
              <img
                src={loggedInUserData?.photoUrl}
                onClick={() => setToggle(!toggle)}
                className="w-7 h-7 object-cover rounded-full hidden md:flex cursor-pointer"
              />
            ) : (
              <FaUserCircle
                onClick={() => setToggle(!toggle)}
                className="text-3xl hidden md:flex  cursor-pointer text-gray-500"
              />
            )}
            <FaSearch className="text-lg md:hidden flex" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 left-0 z-40 ${
          sideBarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-2 mt-5">
          <SideBarItem
            icon={<FaHome />}
            text="Home"
            open={sideBarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SideBarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sideBarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SideBarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sideBarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => setSelectedItem("Subscriptions")}
          />
        </nav>
        <hr className="my-3 border-gray-800" />
        {sideBarOpen && <p className="text-md text-gray-400 px-4">You</p>}
        <nav className="space-y-2 mt-4">
          <SideBarItem
            icon={<FaHistory />}
            text="History"
            open={sideBarOpen}
            selected={selectedItem === "History"}
            onClick={() => setSelectedItem("History")}
          />
          <SideBarItem
            icon={<RiPlayList2Fill />}
            text="Playlist"
            open={sideBarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => setSelectedItem("Playlist")}
          />
          <SideBarItem
            icon={<GoVideo />}
            text="Saved Videos"
            open={sideBarOpen}
            selected={selectedItem === "Saved Videos"}
            onClick={() => setSelectedItem("Saved Videos")}
          />
          <SideBarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sideBarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {
              setSelectedItem("Liked Videos");
              navigate("/liked-content");
            }}
          />
        </nav>
        <hr className="my-3 border-gray-800" />
        {sideBarOpen && (
          <p className="text-md text-gray-400 px-4">Subscriptions</p>
        )}
        <nav className="space-y-2 mt-4"></nav>
      </aside>

      {/* Mobile BottomBar */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-gray-800 flex justify-around items-center py-2">
        <MobileBarItem
          icon={<FaHome />}
          text="Home"
          active={activeItem === "Home"}
          onClick={() => {
            setActiveItem("Home");
            navigate("/");
          }}
        />
        <MobileBarItem
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={activeItem === "Shorts"}
          onClick={() => {
            setActiveItem("Shorts");
            navigate("/shorts");
          }}
        />
        <MobileBarItem
          icon={<IoIosAddCircle size={40} />}
          active={activeItem === "+"}
          onClick={() => {
            setActiveItem("+");
            navigate("/create-content");
          }}
        />
        <MobileBarItem
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={activeItem === "Subscriptions"}
          onClick={() => setActiveItem("Subscriptions")}
        />
        <MobileBarItem
          icon={
            loggedInUserData?.photoUrl ? (
              <img
                src={loggedInUserData?.photoUrl}
                className="w-6 h-6 object-cover rounded-full"
              />
            ) : (
              <FaUserCircle />
            )
          }
          text="You"
          active={activeItem === "You"}
          onClick={() => {
            setActiveItem("You");
            navigate("/mobileProfileView");
          }}
        />
      </aside>

      {/* Profile of loggedInUser */}
      {toggle && <Profile setToggle={setToggle} />}

      {/* Main Content */}
      <main
        className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sideBarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {location.pathname === "/" && (
          <div className="flex pt-2 scrollbar-hide mt-[56px] items-center gap-2 overflow-x-auto">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className="bg-[#272727] px-4 py-1.5 rounded-md cursor-pointer hover:bg-zinc-700 transition duration-300 ease-in-out text-sm whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>
        )}
        <div>
          {location.pathname === "/" && <DisplayVideosInHomePage />}
          {location.pathname === "/" && <DisplayShortsInHomePage />}
        </div>
        <div className="mt-17">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function SideBarItem({ icon, text, selected, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
      } ${
        selected
          ? "bg-[#272727]"
          : "bg-[#121212] hover:bg-zinc-800 transition duration-300 ease-in-out"
      } cursor-pointer`}
    >
      <span className="text-lg">{icon}</span>
      {open && <span className="text-sm">{text}</span>}
    </button>
  );
}

function MobileBarItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg w-full transition-all duration-300 justify-center ${
        active
          ? "text-white"
          : "text-gray-400 hover:text-white transition duration-300 ease-in-out scale-105"
      } cursor-pointer`}
    >
      <span className="text-2xl">{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}

export default Home;
