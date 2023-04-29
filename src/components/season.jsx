import React, {useContext} from "react";

const SeasonContext = React.createContext(undefined);

function useSeason() {
    return useContext(SeasonContext).season;
}

export {SeasonContext, useSeason};