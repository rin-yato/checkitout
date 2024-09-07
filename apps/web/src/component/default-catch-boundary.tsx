import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "./ui/button";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => router.invalidate()}>Try Again</Button>
        {isRoot ? (
          <Link
            to="/"
            className={
              "rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700"
            }
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={
              "rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700"
            }
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
