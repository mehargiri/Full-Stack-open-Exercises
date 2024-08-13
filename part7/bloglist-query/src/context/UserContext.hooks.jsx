import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

export const useUserValue = () => {
	return useContext(UserContext)[0];
};

export const useUserDispatch = () => {
	return useContext(UserContext)[1];
};
