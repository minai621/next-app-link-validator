"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

async function getId(): Promise<number> {
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.floor(Math.random() * 100));
        }, 1000);
    });
}


export default function ClientComp() {

    useEffect(() => {
        window.confirm("client comp");
        window.confirm("after hydrate");
    }, []);

    const onClick = () => {
        window.confirm("hydrate click");
    };

    
    // 비동기적으로 id 가져와서 Link 시키기 
    const [id, setId] = useState(0);
    useEffect(() => {
        getId().then((id) => {
            setId(id);
        });
    }, []);

    return <div>
        <button onClick={onClick}>hydrate button</button>
        <Link href={`/test1/${id}`}>im client</Link>

        <Link href={`https://toss.im/career/job-detail?job_id=6008304003`}>im client</Link>
    </div>;
}

