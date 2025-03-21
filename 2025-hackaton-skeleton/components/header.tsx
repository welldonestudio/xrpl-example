"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Wallet } from "./wallet";
import Link from "next/link";

export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <div>
      <div className="z-10 w-full px-10 py-3 flex items-center justify-between font-mono text-sm">
        <Link href={"/"}>
          <h1 className="font-mono text-md font-extrabold">XRPL Skeleton</h1>
        </Link>
        <Wallet />
      </div>

      <div className="z-10 w-full px-10 flex items-center gap-10 font-mono text-sm">
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/");
          }}
        >
          Page1
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/");
          }}
        >
          Page2
        </Button>
      </div>
    </div>
  );
};
