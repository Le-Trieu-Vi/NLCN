import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DishService from "../../services/DishService";
import Loading from "../../components/Loading";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Helper from "../../utils/Helper";

function HomePage() {
  const navigate = useNavigate();
  const [dishTop, setDishTop] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDishTop() {
    const data = await DishService.fetchDishTop();
    setDishTop(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchDishTop();
  }, []);

  console.log(dishTop);


  return (
    <>
      <div className=" w-full">
        <div className="inset-0 h-[500px] bg-background-home bg-fixed overl relative">
          <div className="bg-black/30 absolute w-full h-full">
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Chào mừng bạn đến với Larana</h1>
            <p className="mt-5 text-lg">
              Chúng tôi rất hân hạnh khi được phục vụ bạn những bữa ăn ngon miệng và chất lượng nhất.
            </p>
          </div>
          <div className="absolute bottom-20 left-0 right-0 flex justify-center mb-10">
            <button className=" px-8 py-3 rounded-full font-semibold text-lg text-deep-orange-600 border-2 border-deep-orange-600 hover:bg-deep-orange-600 hover:text-white"
              onClick={() => navigate('/dish')}
            >Đặt ngay</button>
          </div>
        </div>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-deep-orange-600">
              Món ăn nổi bật
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-20">
              {dishTop.map((dish, index) => (
                <Card className="mt-6 w-72">
                  <CardHeader color="blue-gray" className="relative h-56">
                    <img
                      src={`http://localhost:3001/uploads/dishes/${dish.image}`}
                      alt="dish-image"
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                  <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {dish.name}
                    </Typography>
                    <Typography>
                      {dish.description}
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                    <Button onClick={() => navigate('/dish')} color="white" className="border text-deep-orange-600 border-deep-orange-600 hover:bg-deep-orange-600 hover:text-white">Xem thêm</Button>
                  </CardFooter>
                </Card>
                // <Card className="shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-3xl max-w-xs mx-auto">
                //   <CardHeader shadow={false} floated={false} className="h-44">
                //     <img
                //       src={`http://localhost:3001/uploads/dishes/${dish.image}`}
                //       alt="dish-image"
                //       className="h-full w-full object-cover"
                //     />
                //   </CardHeader>
                //   <CardBody>
                //     <div className="flex items-center justify-between">
                //       <Typography color="blue-gray" className="font-semibold text-sm">
                //         {dish.name}
                //       </Typography>
                //       <Typography color="blue-gray" className="font-semibold text-sm">
                //         {Helper.customPrice(dish.prices[0].price)}
                //       </Typography>
                //     </div>
                //     <Typography color="gray" className="w-full mt-4 flex justify-between items-center">

                //       <Button
                //         ripple={false}
                //         fullWidth={true}
                //         color="white"
                //         onClick={() => addToCart(dish)}
                //         className="z-10 shadow-none hover:scale-105 transition-transform text-xs p-2.5 mx-4 rounded-md text-deep-orange-600 border border-deep-orange-600 hover:bg-deep-orange-600 hover:text-white"
                //       >
                //         Thêm
                //       </Button>
                //     </Typography>
                //   </CardBody>
                // </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
