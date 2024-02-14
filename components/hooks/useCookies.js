import { useEffect, useState } from "react";

export default function useCookies(){
    const [cookies, setCookies] = useState({})
    useEffect(()=>{

        const userCookies = document.cookie.replace(/\s/g, "").split(';');
        console.log(userCookies)
        const parsedCookies = {};

        userCookies.forEach(cookie => {
            const [key, value] = cookie.split('=');
            parsedCookies[key] = value;
        });
        setCookies(parsedCookies)
    }, [])
    return cookies
}