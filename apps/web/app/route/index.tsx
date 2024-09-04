import { createFileRoute } from "@tanstack/react-router";
import ky from "ky";
import { ArrowDownLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

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
    <main className="h-dvh flex flex-col items-center pt-28">
      <section className="flex flex-col items-center max-w-[224px] w-full">
        <input
          onKeyDown={handleKeyDown}
          type="number"
          className="border rounded px-3 py-2"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />

        <hr className="my-10" />

        {transaction?.qr && <QRCodeSVG value={transaction?.qr ?? ""} />}

        <hr className="my-10" />

        <ul className="px-3 rounded bg-gray-50 w-full [&>:nth-child(even)]:border-y *:py-3">
          {receipts.map((receipt, i) => (
            <li
              className="flex gap-x-3 items-center animate-in zoom-in-50"
              key={receipt.data.hash}
            >
              <ArrowDownLeft size={20} className="bg-green-500 text-white rounded-full p-0.5" />
              Received {receipt.data.amount} {receipt.data.currency}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
