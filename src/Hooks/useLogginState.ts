import { useEffect, useState } from "react";

export default function useLoggingState(initialValue:any){
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        console.log(value);
    },[value]);

    return [value, setValue];
}