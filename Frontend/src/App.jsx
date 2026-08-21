import { AuthProvider } from "./features/auth/auth.context";
function App() {
  return (
    <AuthProvider>
      <div>Hello</div>
    </AuthProvider>
  );
}

export default App;
