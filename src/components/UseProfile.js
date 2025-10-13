import {useEffect, useState} from "react"

export default function UseProfile() {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('/api/profile').then(response => {
            response.json().then(data => {
                setData(data);
                setLoading(false);
            });
        })
    }, []);

    return {loading, data};
}