import { createContext, useReducer } from "react";

const userReducer = (state, action) => {
	switch (action.type) {
		case "SET":
			return action.payload;
		case "RESET":
			return null;
	}
};

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
	const [user, dispatchUser] = useReducer(userReducer, null);

	return (
		<UserContext.Provider value={[user, dispatchUser]}>
			{children}
		</UserContext.Provider>
	);
};
