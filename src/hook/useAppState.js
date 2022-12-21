import { useContext } from "react";
import { StdInfoProviderContext } from "../context/StdInfoProvider";

const useAppState = () => {
    const { value } = useContext(StdInfoProviderContext);

    if (!value) {
        throw new Error("useAppState must be used within the AppProvider");
    }
    return value;
};

export default useAppState;