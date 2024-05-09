import Chart from "@/components/UserChart";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Widget from "@/components/Widget";
import GenerateChart from "@/components/GenerateChart";
const Home = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="flex-grow w-5/6">
        <Navbar />
        <div className="flex p-20 gap-20">
          <Widget type="user" />
          <Widget type="generation" />
        </div>
        <div className="flex">
          <Chart />
          <GenerateChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
