import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot, setConfig } from "react-hot-loader";

const Top = props => (
    <div>
    </div>
);

setConfig({ logLevel: "debug" });

hot(module)(Top);
ReactDOM.render(<Top />, document.getElementById("root"));

// ---
