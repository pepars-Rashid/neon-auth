import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function Page(props: {
	params: { stack?: string[] };
	searchParams: Record<string, string>;
}) {
	return <StackHandler app={stackServerApp} fullPage routeProps={props} />;
} 