import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";
import { Dialog, DialogPanel, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

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
      const userData = await AuthService.getUser();
      setUser(userData);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleStatusChange = (status) => {
    navigate(`/table?status=${status}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
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
        {AuthService.isAuthenticated() && window.location.pathname !== "/login" && (
          <>
            {AuthService.isAdmin() ? (
              <div className="hidden lg:flex lg:gap-x-12">
                <button
                  onClick={() => navigate("/statistic")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    isActive("/statistic") ? "text-indigo-600" : ""
                  )}
                >
                  Thống kê
                </button>
                <button
                  onClick={() => navigate("/table-manager")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    isActive("/table-manager") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý bàn
                </button>
                <button
                  onClick={() => navigate("/category")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    isActive("/category") || isActive("/dish") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý món ăn
                </button>
                <button
                  onClick={() => navigate("/user")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    isActive("/user") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý nhân viên
                </button>
                <button
                  onClick={() => navigate("/order")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    isActive("/order") ? "text-indigo-600" : ""
                  )}
                >
                  Quản lý hóa đơn
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex lg:gap-x-12">
                <button
                  onClick={() => handleStatusChange("all")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    location.search.includes("status=all") ? "text-indigo-600" : ""
                  )}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => handleStatusChange("available")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    location.search.includes("status=available") ? "text-indigo-600" : ""
                  )}
                >
                  Còn trống
                </button>
                <button
                  onClick={() => handleStatusChange("unavailable")}
                  className={classNames(
                    "text-sm font-semibold leading-6 text-gray-900",
                    location.search.includes("status=unavailable") ? "text-indigo-600" : ""
                  )}
                >
                  Đang sử dụng
                </button>
              </div>
            )}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center text-sm font-semibold leading-6 text-gray-900">
                    <span className="sr-only">Open user menu</span>
                    <span className="hidden lg:inline mx-2">{user ? user.fullname : ""}</span>
                    <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                    <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
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
                  <Menu.Items className="absolute right-0 z-30 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => user && navigate(`/profile/${user.id}`)}
                            className={classNames(
                              "block px-4 py-2 text-sm font-semibold leading-6 text-gray-900 w-full text-left",
                              active ? "bg-gray-100" : ""
                            )}
                          >
                            Thông tin cá nhân
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    {AuthService.isStaff() && (
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => user && navigate(`/order-user/${user.id}`)}
                              className={classNames(
                                "block px-4 py-2 text-sm font-semibold leading-6 text-gray-900 w-full text-left",
                                active ? "bg-gray-100" : ""
                              )}
                            >
                              Lịch sử đặt hàng
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    )}
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              "block px-4 py-2 text-sm font-semibold leading-6 text-gray-900 w-full text-left",
                              active ? "bg-gray-100" : ""
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
          </>
        )}
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
                {AuthService.isAdmin() ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStatusChange("all")}
                      className={classNames(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                        location.search.includes("status=all") ? "text-indigo-600" : ""
                      )}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => handleStatusChange("available")}
                      className={classNames(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                        location.search.includes("status=available") ? "text-indigo-600" : ""
                      )}
                    >
                      Còn trống
                    </button>
                    <button
                      onClick={() => handleStatusChange("unavailable")}
                      className={classNames(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                        location.search.includes("status=unavailable") ? "text-indigo-600" : ""
                      )}
                    >
                      Đang sử dụng
                    </button>
                  </>
                )}
              </div>
              <div className="py-4">
                {AuthService.isAuthenticated() ? (
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
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <hr />
    </header>
  );
}
