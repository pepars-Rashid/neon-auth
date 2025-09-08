import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

// Define the type for your params as a Promise
type ParamsType = Promise<{ stack?: string[] }>;

export default async function Page(props: {
  params: ParamsType;
  searchParams: Record<string, string>;
}) {
  // Await the params promise to resolve
  const resolvedParams = await props.params;
  
  return <StackHandler app={stackServerApp} fullPage routeProps={{ ...props, params: resolvedParams }} />;
}