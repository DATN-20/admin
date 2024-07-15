import LogsTable from "@/components/LogsTable";
import Sidebar from "@/components/Sidebar";
const Logs = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <LogsTable />
      </div>
    </div>
  );
};

export default Logs;
