import React, { useState, useEffect } from "react";
import api from "../../config/Api";
import Chart from "react-apexcharts";
import Helper from "../../utils/Helper";
import {
  Menu,
  Card,
  Button,
  CardBody,
  MenuItem,
  MenuList,
  CardHeader,
  Typography,
  MenuHandler,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function ChartsCard({
  chart,
  title,
  revenue,
  solana,
  timeUnit,
  handChangeTimeUnit,
}) {

  return (
    <Card className="shadow-md border border-gray-200 w-full h-fit">
      <CardHeader
        shadow={false}
        floated={false}
        className="flex items-start justify-between rounded-none overflow-visible"
      >
        <div>
          <Typography
            variant="small"
            className="text-gray-600 font-medium mb-1"
          >
            {title}
          </Typography>
          <Typography variant="h3" color="blue-gray">
            {revenue[0]}{" "}
            {solana ? (
              <span className="text-gray-500">{revenue[1]}</span>
            ) : (
              <span className="text-gray-500 text-lg">{revenue[1]}</span>
            )}
          </Typography>
        </div>
        <Menu>
          <MenuHandler>
            <Button
              size="sm"
              color="gray"
              variant="outlined"
              className="flex items-center gap-1 !border-gray-300"
            >
              <span className="text-gray-900">{timeUnitChoices[timeUnit]}</span>
              <ChevronDownIcon
                strokeWidth={4}
                className="w-3 h-3 text-gray-900"
              />
            </Button>
          </MenuHandler>
          <MenuList>
            {Object.entries(timeUnitChoices).map(([key, value]) => (
              <MenuItem onClick={handChangeTimeUnit(key)}>{value}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      </CardHeader>
      <Chart {...chart} />
    </Card>
  );
}

function TransactionCard({ img, name, total }) {
  return (
    <Card className="shadow-md border border-gray-200">
      <CardBody className="p-3">
        <img src={img} className="h-6 w-6 mb-2" alt={name} />
        <Typography
          variant="small"
          className="text-gray-600 font-medium mb-1"
        >
          {name}
        </Typography>
        <Typography variant="h3" color="blue-gray">
          {total}{" "}
          <span className="text-gray-500 text-lg uppercase"></span>
        </Typography>
      </CardBody>
    </Card>
  );
}

const timeUnitChoices = {
  "30day": "30 ngày qua",
  "6month": "6 tháng qua",
  "1year": "1 năm qua",
}

function Statistic() {
  const [revenueData, setRevenueData] = useState([]);

  const [timeUnit, setTimeUnit] = useState("30day");
  const [summary, setSummary] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/statistics/revenue?timeUnit=${timeUnit}`);
        console.log(response.data.map((item) => item.total_revenue));

        setRevenueData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchSummary = async () => {
      try {
        const response = await api.get(`/statistics/summary`);
        setSummary(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    fetchSummary();
  }, [timeUnit]);

  function handChangeTimeUnit(value) {
    return () => {
      setTimeUnit(value);
    }
  }

  const priceChart = {
    type: "area",
    height: 350,
    series: [
      {
        name: "Doanh thu",
        data: revenueData.map((item) => ({ x: item.time, y: item.total_revenue })),
      },
    ],
    options: {
      chart: {
        type: 'area',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#388e3c"],
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: revenueData.map((item) => item.time),
      },
    },
  };


  const totalRevanue = revenueData.reduce((total, value) => total + value.total_revenue, 0);
  const totalOrder = revenueData.reduce((total, value) => total + value.total_orders, 0);

  const ChartsCardData = [
    {
      title: "Doanh thu",
      revenue: [Helper.customPrice(totalRevanue), `/ ${totalOrder} đơn hàng`],
      chart: priceChart,
      solana: false,
      timeUnit: timeUnit,
      handChangeTimeUnit: handChangeTimeUnit,
    },

  ];

  const TransactionCardData = [
    {
      img: "https://cdn3.iconfinder.com/data/icons/okku-delivery/32/Delivery_Okku_Expand-37-128.png",
      name: "Đơn hàng",
      total: summary.totalOrders,
    },
    {
      img: "https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/shrimp-fried-rice-food-dish-128.png",
      name: "Danh mục món ăn/ Món ăn",
      total: `${summary.totalCategories}/${summary.totalDishes}`,
    },
    {
      img: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-128.png",
      name: "Tài khoản",
      total: summary.totalUsers,
    },
  ];

  return (
    <section className="px-8 pt-2">
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-1 lg:gap-x-5 gap-y-5">
        <div className="col-span-4 lg:grid lg:space-y-0 space-y-5 gap-5">
          {ChartsCardData.map((props, key) => (
            <ChartsCard key={key} {...props} />
          ))}
        </div>
        <div className="col-span-full xl:col-span-1 w-full grid-cols-1 md:grid xl:grid-cols-1 gap-1 space-y-5 md:space-y-0">
          {TransactionCardData.map((props, key) => (
            <TransactionCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Statistic;