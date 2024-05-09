import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import UsersTable from "@/components/UsersTable";
const Users = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <Navbar />
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;
