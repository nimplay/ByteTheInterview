"use client"; // Required for using states and effects in Next.js 13+

import { useState } from "react";
import Image from "next/image";
import { DialogPanel, Dialog, DialogTitle } from "@headlessui/react"; // Install @headlessui/react

export default function Footer() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  return (
    <footer className="flex gap-4 flex-wrap items-center justify-center mt-4 text-gray-400 text-sm md:text-base p-4">
      <p>© By Nimrod Acosta 2025</p>
      {/* About me button */}
      <button
        onClick={() => setIsAboutOpen(true)}
        className="hover:text-gray-600 transition-colors"
      >
        About me
      </button>
      {/* Sources button */}
      <button
        onClick={() => setIsSourcesOpen(true)}
        className="hover:text-gray-600 transition-colors"
      >
        Sources
      </button>
      {/* About me Modal */}
      <Dialog
        open={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        className="relative z-50"
      >
        {/* Blur background */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[3px]"
          aria-hidden="true"
        />

        {/* Main container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300">
            {/* Styled close button */}
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute right-4 top-4 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200"
            >
              &times;
            </button>

            {/* Gradient header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5">
              <DialogTitle className="text-2xl font-bold text-white text-center">
                About Nimrod Acosta
              </DialogTitle>
            </div>

            {/* Main content */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Photo section */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  <Image
                    src="/images/Nimrod.jpeg"
                    alt="Nimrod Acosta"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>

                {/* Social media */}
                <div className="flex justify-center mt-4 space-x-4">
                  <a
                    href="https://medium.com/@nimrod7day"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/images/medium-svgrepo-com.svg"
                      alt="Medium"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nimrod-acosta/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/images/linkedin-color-svgrepo-com.svg"
                      alt="LinkedIn"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://github.com/nimplay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/images/github-color-svgrepo-com.svg"
                      alt="GitHub"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="mailto:nimrod7day@gmail.com?subject=Contact%20from%20portfolio&body=Hello%20Nimrod,%20I'm%20interested%20in%20contacting%20you%20about..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/images/mail-reception-svgrepo-com.svg"
                      alt="Send email"
                      width={32}
                      height={32}
                      className="w-8 h-8 hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>

              {/* Text section */}
              <div className="flex-grow">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Hello! 👋
                  </h3>
                  <p className="text-gray-700 mb-4">
                    I&apos;m a full-stack and web application developer, as well
                    as a technology enthusiast. I also have experience in video
                    game development and web gamification. I&apos;m passionate
                    about music and develop music for video games and web
                    environments. I want to share this tool I created with you
                    to make studying web development theory easier.
                  </p>
                  <p className="text-gray-700 mb-4">
                    If you&apos;ve made it this far, I&apos;d like to thank you
                    for all your support. I hope this tool helps you achieve
                    your goals and contributes to your professional development.
                    THANK YOU VERY MUCH!!!
                  </p>
                  <div className="bg-blue-50/50 border-l-4 border-blue-400 p-3 rounded-r">
                    <p className="text-blue-800 italic">
                      Passionate about creating innovative and creative
                      solutions to achieve success.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popup footer */}
            <div className="bg-gray-100 p-4 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      {/* Sources Modal */}
      <Dialog
        open={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
        className="relative z-50"
      >
        {/* Blur background with dark overlay */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[3px]"
          aria-hidden="true"
        />

        {/* Main container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
            {/* Enhanced close button */}
            <button
              onClick={() => setIsSourcesOpen(false)}
              className="absolute right-4 top-4 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200"
            >
              &times;
            </button>

            {/* Gradient header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5">
              <DialogTitle className="text-2xl font-bold text-white text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
                  Sources & Credits
                </span>
              </DialogTitle>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
              {/* Technologies section */}
              <section className="bg-gray-700/50 rounded-xl p-5 backdrop-blur-sm border border-gray-600/50">
                <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Technologies used
                </h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Next.js",
                    "Tailwind CSS",
                    "React",
                    "TypeScript",
                    "API OpenRouter",
                    "Deepseek",
                  ].map((tech) => (
                    <li key={tech} className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      <span className="text-gray-200 hover:text-white transition-colors">
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Icons section */}
              <section className="bg-gray-700/50 rounded-xl p-5 backdrop-blur-sm border border-gray-600/50">
                <h3 className="font-bold text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                  Icon Credits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Python",
                      url: "https://icons8.com/icon/13441/python",
                    },
                    {
                      name: "TypeScript",
                      url: "https://icons8.com/icon/uJM6fQYqDaZK/typescript",
                    },
                    {
                      name: "JavaScript",
                      url: "https://icons8.com/icon/108784/javascript",
                    },
                    {
                      name: "React",
                      url: "https://icons8.com/icon/NfbyHexzVEDk/react",
                    },
                    {
                      name: "Ruby",
                      url: "https://icons8.com/icon/22189/ruby-programming-language",
                    },
                    {
                      name: "PostgreSQL",
                      url: "https://icons8.com/icon/38561/postgresql",
                    },
                    {
                      name: "Padlock",
                      url: "https://icons8.com/icon/118981/lock",
                    },
                    { name: "SVGRepo", url: "https://www.svgrepo.com" },
                  ].map((icon) => (
                    <a
                      key={icon.name}
                      href={icon.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-600/30 hover:bg-gray-600/50 transition-all group border border-gray-600 hover:border-purple-400"
                    >
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {icon.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-200 group-hover:text-white transition-colors">
                        {icon.name}{" "}
                        {icon.name !== "SVGRepo" && (
                          <span className="text-sm text-gray-400">
                            by Icons8
                          </span>
                        )}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-auto text-gray-400 group-hover:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>

              {/* Thank you section */}
              <div className="text-center py-4">
                <p className="text-gray-400 italic">
                  Made with ❤️ using these amazing technologies and resources
                </p>
              </div>
            </div>

            {/* Popup footer */}
            <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-3 text-center">
              <p className="text-white/90 text-sm font-medium">
                Thank you for visiting! ✨
              </p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </footer>
  );
}
