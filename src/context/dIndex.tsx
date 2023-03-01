import { createContext } from "react";

const DIndexContext = createContext({
    currentDimensions: 2,
    modifyDimensions: (val: Number) => {}
});

export default DIndexContext;