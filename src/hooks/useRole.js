import { useContext } from "react";
import { UserContext } from "../components/Contexts/UserContext";


const useRole = (requiredRoles) => {
    const { roles } = useContext(UserContext);

    return requiredRoles && requiredRoles.map(role => roles?.includes(role));

}

export default useRole;