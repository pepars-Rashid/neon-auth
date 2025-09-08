import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

// Define the type for params as a Promise
type ParamsType = Promise<{ stack?: string[] }>;

// Define the type for searchParams as a Promise
type SearchParamsType = Promise<Record<string, string>>;

export default async function Page(props: {
  params: ParamsType;
  searchParams: SearchParamsType;
}) {
  // Await both params and searchParams promises to resolve
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  return (
    <StackHandler
      app={stackServerApp}
      fullPage
      routeProps={{
        ...props,
        params: resolvedParams,
        searchParams: resolvedSearchParams,
      }}
    />
  );
}