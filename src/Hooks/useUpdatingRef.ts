import { useEffect, useRef } from "react";

export default function useUpdatingRef<Type>(value?:Type){
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value])

    return ref;
}