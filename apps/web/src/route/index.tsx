import ky from "ky";

import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [amount, setAmount] = useState(1000);
  const [transaction, setTransaction] = useState<null | {
    md5: string;
    qr: string;
  }>(null);

  const [receipts, setReceipts] = useState<any[]>([]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const res = await ky
      .post("transaction/create", {
        json: { amount },
        prefixUrl: "http://localhost:3000",
      })
      .json<any>();

    setTransaction(res.data);
  };

  useEffect(() => {
    if (!transaction) return;

    // connect to an sse endpoint
    const eventSource = new EventSource(
      `http://localhost:3000/transaction/track/${transaction.md5}`,
    );

    eventSource.onmessage = async (e) => {
      const data = e.data;

      console.log("SSE data:", data);

      if (data === "PENDING") return;

      if (data === "COMPLETED") {
        eventSource.close();

        const res = await ky
          .get(`transaction/get-by-md5/${transaction.md5}`, {
            prefixUrl: "http://localhost:3000",
          })
          .json<any>();

        setReceipts((prev) => [...prev, res.data]);
      }

      if (data === "FAILED") {
        console.log("Transaction failed");
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [transaction]);

  return (
    <main className="flex h-dvh flex-col items-center pt-28">
      <section className="flex w-full max-w-[224px] flex-col items-center">
        <input
          onKeyDown={handleKeyDown}
          type="number"
          className="rounded border px-3 py-2"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />

        <hr className="my-10" />

        {transaction?.qr && <QRCodeSVG value={transaction?.qr ?? ""} />}

        <hr className="my-10" />

        <ul className="w-full rounded bg-gray-50 px-3 *:py-3 [&>:nth-child(even)]:border-y">
          {receipts.map((receipt, i) => (
            <li
              className="zoom-in-50 flex animate-in items-center gap-x-3"
              key={receipt.data.hash}
            >
              <ArrowDownLeft size={20} className="rounded-full bg-green-500 p-0.5 text-white" />
              Received {receipt.data.amount} {receipt.data.currency}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
