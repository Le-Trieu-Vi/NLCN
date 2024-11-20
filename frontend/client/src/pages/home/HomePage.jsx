import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DishService from "../../services/DishService";
import Loading from "../../components/Loading";

function HomePage() {
  const navigate = useNavigate();
  const [dishTop, setDishTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDishTop() {
      const data = await DishService.fetchDishTop();
      setDishTop(data);
      setLoading(false);
    }
  }, []);

  console.log();
  

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
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
             
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
