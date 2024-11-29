import Link from "next/link";
import ClientComp from "./client-comp";

export default function Test1() {
    const variableLink = "/test1/1";
    return (
        <div>
            <ClientComp />
            <Link href={variableLink}>test2</Link>
            <Link href="https://toss.im/career/job-detail?job_id=6008304003">toss</Link>
        </div>
    );
}
