import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Dialog, DialogPanel, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";


import Cart from "./CartIcon";
import AuthService from "../services/AuthService";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AuthService.getUserInfo();
      setUser(userData);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const checkPathIsNotLoginAndRegister = () => {
    return location.pathname !== '/login' && location.pathname !== '/register';
  }

  return (
    <header className="bg-white sticky top-0 z-10 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between lg:px-8 py-2" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/">
            <span className="sr-only">Larana</span>
            <img className="h-10 w-auto rounded-full" src="./logo.png" alt="Larana Logo" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {checkPathIsNotLoginAndRegister() && (
          <>
            <div className="hidden lg:flex lg:gap-x-12 mx-40">
              <button
                onClick={() => navigate("/")}
                className={classNames(
                  "text-sm font-semibold leading-6",
                  isActive("/") ? "text-deep-orange-400" : "text-gray-900"
                )}
              >
                Trang chủ
              </button>
              <button
                onClick={() => navigate("/dish")}
                className={classNames(
                  "text-sm font-semibold leading-6",
                  isActive("/dish") ? "text-deep-orange-400" : "text-gray-900"
                )}
              >
                Danh sách món ăn
              </button>
              <button
                onClick={() => {
                  user && navigate(`/order-user/${user.id}`);
                }}
                className={classNames(
                  "text-sm font-semibold leading-6",
                  isActive("/order") ? "text-deep-orange-400" : "text-gray-900"
                )}
              >
                Lịch sử đặt hàng
              </button>
              <button
                onClick={() => {
                  user && navigate(`/profile/${user.id}`);
                }}
                className={classNames(
                  "text-sm font-semibold leading-6",
                  isActive("/profile") ? "text-deep-orange-400" : "text-gray-900"
                )}
              >
                Trang cá nhân
              </button>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {AuthService.isAuthenticated() ? (
                <div className="w-full flex justify-between">
                  <Button
                    onClick={() => navigate("/cart")}
                  >
                    <Cart className="flex justify-center" />
                  </Button>
                  <Menu as="div" className="relative inline-block text-left z-10">
                    <div>
                      <Menu.Button className="flex items-center text-sm font-semibold leading-6 text-gray-900">
                        <UserCircleIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                        <span className="ml-2">{user?.fullname !== '' ? user?.fullname : user?.username}</span>
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  user && navigate(`/profile/${user.id}`);
                                }}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                                  "group flex rounded-md items-center w-full px-2 py-2 text-sm"
                                )}
                              >
                                Thông tin cá nhân
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  user && navigate(`/order-user/${user.id}`);
                                }}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                                  "group flex rounded-md items-center w-full px-2 py-2 text-sm"
                                )}
                              >
                                Lịch sử đặt hàng
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                                  "group flex rounded-md items-center w-full px-2 py-2 text-sm"
                                )}
                              >
                                Đăng xuất
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Đăng nhập
                  </button>
                  <span className="text-sm font-semibold leading-6 text-gray-900 mx-1">|</span>
                  <button
                    onClick={() => navigate("/register")}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </>
        )
        }
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/">
              <span className="sr-only">Larana</span>
              <img className="h-10 w-auto rounded-full" src="./logo.png" alt="Larana Logo" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <button
                  onClick={() => navigate("/table-manager")}
                  className={classNames(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                    isActive("/table-manager") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý bàn
                </button>
                <button
                  onClick={() => navigate("/category")}
                  className={classNames(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                    isActive("/category") || isActive("/dish") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý món ăn
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className={classNames(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                    isActive("/user") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý nhân viên
                </button>
                <button
                  onClick={() => navigate("/order")}
                  className={classNames(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                    isActive("/order") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý hóa đơn
                </button>
              </div>
              <div className="py-4">
                {/* {AuthService.isAuthenticated() ? (
                  <>
                    <button
                      onClick={() => {
                        user && navigate(`/profile/${user.id}`);
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Thông tin cá nhân
                    </button>
                    {!AuthService.isAdmin() && (
                      <button
                        onClick={() => {
                          user && navigate(`/order-user/${user.id}`);
                          setMobileMenuOpen(false);
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Lịch sử đặt hàng
                      </button>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <hr />
    </header>
  );
}
