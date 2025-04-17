import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getDetails } from "../../store/AuthSlice";
import RoomList from "../RoomList/RoomList";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getDetails());
  }, []);
  return (
    <div>
      <RoomList />
    </div>
  );
};

export default Home;
