import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Studio from "@/pages/Studio";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthCallbackHandler from "./components/AuthCallbackHandler";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";

function PrivateRoute({ children }: { children: React.ReactNode }) { return <DashboardLayout>{children}</DashboardLayout>; }
function Router() { return <Switch><Route path="/" component={Home} /><Route path="/dashboard"><PrivateRoute><Studio mode="dashboard" /></PrivateRoute></Route><Route path="/studio"><PrivateRoute><Studio mode="dashboard" /></PrivateRoute></Route><Route path="/create"><PrivateRoute><Studio mode="create" /></PrivateRoute></Route><Route path="/creations"><PrivateRoute><Studio mode="creations" /></PrivateRoute></Route><Route path="/subscription"><PrivateRoute><Studio mode="subscription" /></PrivateRoute></Route><Route path="/profile"><PrivateRoute><Studio mode="profile" /></PrivateRoute></Route><Route path="/admin"><PrivateRoute><Studio mode="admin" /></PrivateRoute></Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><AuthCallbackHandler /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
