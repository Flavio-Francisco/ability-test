import { useSession } from "@/contexts/userContext";
import { getCurrentDate } from "@/functions/getCurrentDate";
import { getMessage } from "@/functions/getMessage";

import React, { useEffect, useState } from "react";

const UserCard: React.FC = () => {
  const { user } = useSession();
  const message = getMessage();
  const currentDate = getCurrentDate();
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          setCity(data.city);
        } else {
          throw new Error("Failed to fetch location data");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="bg-transparent flex flex-col items-center justify-center ">
      <p className="text-sm text-center text-white w-full mb-0">
        {city}
        {"   "} {currentDate}
      </p>

      <p className="text-sm text-center text-white">
        {message} {user?.name}
      </p>
    </div>
  );
};

export default UserCard;
