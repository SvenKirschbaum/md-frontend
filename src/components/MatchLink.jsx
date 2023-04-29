import React from "react";
import {Link} from "react-router-dom";

function MatchLink(props) {
    const {id, children, ...fprops} = props;
    return <Link to={"/match/" + props.id} {...fprops}>{children}</Link>
}

export default MatchLink;