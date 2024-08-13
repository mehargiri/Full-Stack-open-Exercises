import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

export const useUserValue = () => {
	const result = useContext(UserContext);
	return result[0];
};

export const useUserDispatch = () => {
	const result = useContext(UserContext);
	return result[1];
};
