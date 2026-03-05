import { DevCockpit } from "./components/DevCockpit";

export function App() {
  return (
    <>
      {/* your existing app UI here */}
      {import.meta.env.DEV && <DevCockpit />}
    </>
  );
}
