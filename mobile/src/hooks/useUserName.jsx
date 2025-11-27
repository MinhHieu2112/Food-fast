import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUserName() {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch tên mới nhất từ DB nếu cần
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          const name = data.name || session?.user?.name || session?.user?.email || '';
          const firstName = name.includes(' ') ? name.split(' ')[0] : name;
          setUserName(firstName);
        });
    }
  }, [status, session]);

  return { userName, status };
}
