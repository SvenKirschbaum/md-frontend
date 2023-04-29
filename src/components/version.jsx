import React, {useContext} from "react";

const VersionContext = React.createContext("latest");

function withVersion(WrappedComponent) {
    return function (props) {
        const version = useVersion();
        return <WrappedComponent version={version} {...props}/>
    }
}

function useVersion() {
    return useContext(VersionContext);
}

export {VersionContext, withVersion, useVersion};