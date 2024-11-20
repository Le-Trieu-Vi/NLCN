import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    IconButton,
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    PowerIcon,
    HomeIcon,
    BeakerIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";

import AuthService from "../services/AuthService";

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    const toggleOpen = () => setOpen((prev) => !prev);

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

    return (
        <Card
            className={`h-[100vh] transition-all duration-300 ${open ? "w-40" : "w-14"
                } shadow-xl shadow-blue-gray-900/5 flex flex-col items-start bg-black rounded-s-none`}
        >
            <div className={`${open ? "justify-between" : ""} mb-4 flex items-center`}>
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-300 p-4`}
                >
                    {open && (
                        <a href="/">
                            <img
                                className="h-10 w-auto rounded-full"
                                src="./logo.png"
                                alt="Larana Logo"
                            />
                        </a>
                    )}
                </Typography>
                <div className={`${open ? "p-4" : "pt-5 pr-96 mr-96"}`}>
                    <IconButton variant="text" onClick={toggleOpen}>
                        {open ? (
                            <ChevronLeftIcon className="h-8 w-8" color="white" />
                        ) : (
                            <ChevronRightIcon className="h-8 w-8" color="white" />
                        )}
                    </IconButton>
                </div>
            </div>
            <List className="w-2">
                <ListItem className={`${open ? "max-w-36" : "max-w-9 pt-5"} pl-2`} onClick={() => navigate("/")}>
                    <ListItemPrefix className="mr-3 ">
                        <HomeIcon className="h-5 w-5" color="white" />
                    </ListItemPrefix>
                    {open && (
                        <Typography variant="small" color="white" className="transition-opacity duration-300">
                            Trang chủ
                        </Typography>
                    )}
                </ListItem>
                <ListItem className={`${open ? "max-w-36" : "max-w-9"} pl-2`} onClick={() => navigate("/dish")}>
                    <ListItemPrefix className="mr-3">
                        <BeakerIcon className="h-5 w-5" color="white" />
                    </ListItemPrefix>
                    {open && (
                        <Typography variant="small" color="white" className="transition-opacity duration-300">
                            Món ăn
                        </Typography>
                    )}
                </ListItem>
                <ListItem className={`${open ? "max-w-36" : "max-w-9"} pl-2`}
                    onClick={() => {
                        user && navigate(`/profile/${user.id}`);
                    }}
                >
                    <ListItemPrefix className="mr-3">
                        <UserCircleIcon className="h-5 w-5" color="white" />
                    </ListItemPrefix>
                    {open && (
                        <Typography variant="small" color="white" className="transition-opacity duration-300">
                            Tài khioản
                        </Typography>
                    )}
                </ListItem>
                <ListItem className={`${open ? "max-w-36" : "max-w-9"} pl-2`} onClick={handleLogout}>
                    <ListItemPrefix className="mr-3">
                        <PowerIcon className="h-5 w-5" color="white" />
                    </ListItemPrefix>
                    {open && (
                        <Typography variant="small" color="white" className="transition-opacity duration-300">
                            Đăng xuất
                        </Typography>
                    )}
                </ListItem>
            </List>
        </Card>
    );
}
