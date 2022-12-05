/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

export default function useForceUpdate(){
    const [value, setValue] = useState(false); // integer state
    return () => setValue(value => !value); // update state to force render
}