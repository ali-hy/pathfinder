import { useEffect, useRef } from "react";

export default function useUpdatingRef(value?:any){
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value])

    return ref;
}