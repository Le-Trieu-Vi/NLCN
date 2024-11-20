import { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuCategory({ onCategoryChange }) {
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          console.error("Vui lòng đăng nhập!");
          return;
        }

        const response = await api.get(`/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelected(category);
    onCategoryChange(category.id);
  };

  return (
    <Listbox value={selected} onChange={handleCategoryChange}>
      {({ open }) => (
        <>
          <div className="relative mt-2 min-w-48">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <img
                  src="../../uploads/default.jpeg"
                  alt=""
                  className="h-5 w-5 flex-shrink-0 rounded-full"
                />
                <span className="ml-3 block truncate">
                  {selected ? selected.name : "Chọn danh mục"}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {categories &&
                  categories.map((category) => (
                    <ListboxOption
                      key={category.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "",
                          !active ? "text-gray-900" : "",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={category}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={
                                category.image
                                  ? `/uploads/categories/${category.image}`
                                  : "https://via.placeholder.com/256"
                              }
                              alt="Ảnh danh mục"
                              className="h-5 w-5 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {category.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
              </ListboxOptions>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
