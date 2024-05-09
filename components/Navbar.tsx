import Image from "next/image";

import {
  SearchOutlined,
  NotificationOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  return (
    <div className="navbar h-16 border-b border-gray-300 flex items-center text-sm text-gray-600">
      <div className="wrapper w-full px-4 flex items-center justify-between">
        <div className="search flex items-center border border-gray-300 rounded p-1">
          <input
            type="text"
            placeholder="Search..."
            className="outline-none bg-transparent"
          />
          <SearchOutlined className="ml-1" />
        </div>
        <div className="items flex items-center">
          <div className="item relative flex items-center mr-4">
            <NotificationOutlined
              className="icon text-lg"
              style={{ fontSize: "32px" }}
            />
            <div className="counter w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center font-semibold absolute top-0 right-0">
              1
            </div>
          </div>
          <div className="item relative flex items-center mr-4">
            <WechatWorkOutlined
              className="icon text-lg"
              style={{ fontSize: "32px" }}
            />
            <div className="counter w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center font-semibold absolute top-0 right-0">
              2
            </div>
          </div>
          <div className="item">
            <Image
              src="/default.jpg"
              alt=""
              className="avatar rounded-full"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
