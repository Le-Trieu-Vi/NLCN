import LoginForm from "./LoginForm";

function Login() {
  return (
    <section className="bg-gray-50 min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md p-5 bg-white rounded-lg shadow">
        <div className="space-y-6">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Đăng nhập
          </h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export default Login;
