import { useContext } from "react";
import { StdInfoProviderContext } from "../context/StdInfoProvider";

const useListState = () => {
    const { list } = useContext(StdInfoProviderContext);

    if (!list) {
        throw new Error("useListState must be used within th e AppProvider");
    }
    return list;
};

export default useListState;