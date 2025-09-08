// src/login/screens/LoginScreen.jsx
import HImage from "../../assets/pictures/H.png"
import logo from "../../assets/pictures/logo.png"

export default function LoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-950 via-green-800 to-green-600 p-6">
      <div className="flex w-full max-w-7xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center text-white p-12">
          {/* Background image */}
          <img
            src={HImage}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          {/* Strong green overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-green-800/60 to-green-700/70"></div>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xl font-bold">YOUR LOGO</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Hello, welcome!</h1>
            <p className="text-green-100 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi risus.
            </p>
            <button className="rounded-lg bg-white px-6 py-3 text-green-700 font-semibold shadow hover:bg-gray-100">
              View more
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-12">
          <div className="w-full max-w-lg flex flex-col items-center">
            {/* Centered logo */}
                                      <img 
              src={logo} 
              alt="Logo" 
              className="mb-6 max-h-40 w-auto object-contain"
            />


            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

            <form className="w-full space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  placeholder="name@mail.com"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-400" />
                  Remember me
                </label>
                <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-green-800 to-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:from-green-900 hover:to-green-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
