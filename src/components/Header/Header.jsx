import React from "react";
import { useTelegram } from "../../hooks/useTelegram";
import './Header.css';
import { useSelector } from "react-redux";

const Header = () => {
    const { user } = useTelegram();
    const { currentUser } = useSelector((state) => state.users);

    return (
        <div className='header'>
            <span className='username'>
                {user ? user.id : currentUser.username}
            </span>
        </div>
    )
}

export default Header