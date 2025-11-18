import {useEffect, useState} from "react"

export default function UseProfile() {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     fetch('/api/profile').then(response => {
    //         response.json().then(data => {
    //             setData(data);
    //             setLoading(false);
    //         });
    //     })
    // }, []);

    // return {loading, data};

    useEffect(() => {
    fetch("/api/profile")
      .then(res => {
        if (res.status === 401) {
          // Không in lỗi nữa, chỉ set data = null
          return null;
        }
        return res.json();
      })
      .then(profileData => {
        setData(profileData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { loading, data };
}