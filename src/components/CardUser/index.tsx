import { useSession } from "@/contexts/userContext";
import { getCurrentDate } from "@/functions/getCurrentDate";
import { getMessage } from "@/functions/getMessage";


const UserCard: React.FC = () => {
  const { user } = useSession();
  const message = getMessage();
  const currentDate = getCurrentDate();

  return (
    <div className="bg-transparent flex flex-col items-center justify-center ">
      <p className="text-sm text-center text-white w-full mb-0">
        {currentDate}
      </p>

      <p className="text-sm text-center text-white">
        {message} {user?.name}
      </p>
    </div>
  );
};

export default UserCard;
