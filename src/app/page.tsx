/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from './footer/component';

// Import JSON
import javascriptQuestions from "@/lib/data/javascript_questions.json";
import reactQuestions from "@/lib/data/react_questions.json";
import typescriptQuestions from "@/lib/data/typescript_questions.json";
import pythonQuestions from "@/lib/data/python_questions.json";
import rubyQuestions from "@/lib/data/ruby_questions.json";
import databaseQuestions from "@/lib/data/data_base_questions.json";
import machineLearningQuestions from "@/lib/data/machine_learning_questions.json";
import acronymsQuestions from "@/lib/data/acronyms_questions.json";
import { DeepSeekResponse } from "@/lib/types/api-types";

// Data definition
interface Question {
  index: number;
  question: string;
  answer: string;
}

type QuestionsData = Record<string, Question[]>;

export default function Home() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showKofiPopup, setShowKofiPopup] = useState(false);

  // AI Api
  const fetchAiExplanation = async () => {
    if (!currentQuestion?.question || !selectedButton) return;

    setIsAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          topic: selectedButton,
          context: currentQuestion.answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: DeepSeekResponse = await response.json();

      if (!data.explanation) {
        throw new Error("La respuesta de la API no contiene una explicación");
      }

      setAiResponse(data.explanation);
    } catch (err) {
      console.error("Error fetching AI explanation:", err);
      setAiError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado. Por favor intenta nuevamente."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiExplanation = () => {
    fetchAiExplanation();
  };

  const buttons = [
    {
      name: "JavaScript",
      icon: "/images/icons8-javascript-480.svg",
      label: "JavaScript",
      color: "bg-yellow-400",
      textColor: "text-yellow-900",
      borderColor: "border-yellow-500",
      questions: javascriptQuestions,
    },
    {
      name: "react",
      icon: "/images/icons8-react-400.svg",
      label: "React",
      color: "bg-blue-400",
      textColor: "text-blue-900",
      borderColor: "border-blue-500",
      questions: reactQuestions,
    },
    {
      name: "TypeScript",
      icon: "/images/icons8-typescript-480.svg",
      label: "TypeScript",
      color: "bg-blue-600",
      textColor: "text-blue-100",
      borderColor: "border-blue-700",
      questions: typescriptQuestions,
    },
    {
      name: "Python",
      icon: "/images/icons8-python-480.svg",
      label: "Python",
      color: "bg-blue-300",
      textColor: "text-blue-900",
      borderColor: "border-blue-400",
      questions: pythonQuestions,
    },
    {
      name: "Ruby",
      icon: "/images/icons8-ruby-programming-language-480.svg",
      label: "Ruby",
      color: "bg-red-500",
      textColor: "text-red-100",
      borderColor: "border-red-600",
      questions: rubyQuestions,
    },
    {
      name: "Data Base",
      icon: "/images/icons8-postgresql-480.svg",
      label: "Database",
      color: "bg-indigo-400",
      textColor: "text-indigo-900",
      borderColor: "border-indigo-500",
      questions: databaseQuestions,
    },
    {
      name: "Machine Learning",
      icon: "/images/machine-learning-06-svgrepo-com.svg",
      label: "Machine Learning",
      color: "bg-purple-500",
      textColor: "text-purple-100",
      borderColor: "border-purple-600",
      questions: machineLearningQuestions,
    },
    {
      name: "Acronyms",
      icon: "/images/sort-alpabetic-svgrepo-com.svg",
      label: "Acronyms",
      color: "bg-green-500",
      textColor: "text-green-100",
      borderColor: "border-green-600",
      questions: acronymsQuestions,
    },
    {
      name: "Random",
      icon: "/images/random-svgrepo-com.svg",
      label: "Random",
      color: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
      textColor: "text-white",
      borderColor: "border-pink-500",
      questions: null,
    },
  ];

  // Load questions when a button is selected
  useEffect(() => {
    if (!selectedButton) return;

    const buttonData = buttons.find((btn) => btn.name === selectedButton);
    if (!buttonData) return;

    setGameStarted(false);
    setShowAnswer(false);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setError(null);

    // Clear AI response and error
    setAiResponse(null);
    setAiError(null);

    try {
      setIsLoading(true);

      // Question data processing
      const processQuestions = (data: QuestionsData | null): Question[] => {
        if (!data) return [];
        return Object.values(data).flatMap((category) =>
          category.map((q) => ({
            index: q.index,
            question: q.question,
            answer: q.answer,
          }))
        );
      };

      if (selectedButton === "Random") {
        const allQuestions = buttons
          .filter((btn) => btn.name !== "Random" && btn.questions)
          .flatMap((btn) => processQuestions(btn.questions));

        setAvailableQuestions(allQuestions);
        if (allQuestions.length > 0) {
          setCurrentQuestion(allQuestions[0]);
          setQuestionIndex(1);
        }
        return;
      }

      // other buttons
      const allQuestions = processQuestions(buttonData.questions);
      setAvailableQuestions(allQuestions);
      if (allQuestions.length > 0) {
        setCurrentQuestion(allQuestions[0]);
        setQuestionIndex(1);
      }
    } catch (err) {
      console.error("Error loading questions:", err);
      setError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedButton]);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName === selectedButton ? null : buttonName);
  };

  const startGame = () => {
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
      setQuestionIndex(randomIndex + 1);
      setGameStarted(true);
      setShowAnswer(false);
    }
  };

  const nextCard = () => {
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
      setQuestionIndex(randomIndex + 1);
      setShowAnswer(false);
      // clear AI response
      setAiResponse(null);
      setAiError(null);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const selectedButtonData = buttons.find((btn) => btn.name === selectedButton);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 items-center justify-center p-4 dark:bg-gray-900">
      <main className="bg-gray-800 rounded-lg shadow-xl/30 p-4 md:p-8 w-full max-w-6xl">
        <div className="flex flex-col p-4 md:p-8 shadow-xl/30 gap-6 items-center justify-center bg-gray-700 rounded-lg relative">
          {/* ko-fi button */}
          <button
            onClick={() => setShowKofiPopup(true)}
            className="cursor-pointer absolute right-2 top-2 md:right-4 md:top-4 flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow-lg transition-all transform hover:scale-105 z-10"
          >
            <Image
              src="/images/coffee-svgrepo-com.svg"
              alt="Coffee icon"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-8"
            />
            <span className="text-xs font-bold ">Tip me!</span>
          </button>

          {/* Ko-fi popup */}
          {showKofiPopup && (
            <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
              <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                <button
                  onClick={() => setShowKofiPopup(false)}
                  className="absolute -right-2 -top-2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-600 z-10"
                >
                  X
                </button>

                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500 to-pink-500">
                  <div className="bg-gray-100 p-1 rounded-lg">
                    <iframe
                      id="kofiframe"
                      src="https://ko-fi.com/nimplay/?hidefeed=true&widget=true&embed=true&preview=true"
                      className="w-full border-0 rounded-md p-8 bg-white"
                      style={{ height: "712px" }}
                      title="Support me on Ko-fi"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-b-lg text-center">
                  <p className="text-gray-300">
                    Thank you for your support! ❤️
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-8 md:mt-0">
            ByteTheInterview
          </h1>
          <p className="text-lg text-gray-200">Select a Topic.</p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
            <div className="flex flex-wrap gap-3 justify-center w-full">
              {buttons.map((btn) => (
                <button
                  key={btn.name}
                  type="button"
                  onClick={() => handleButtonClick(btn.name)}
                  aria-label={btn.label}
                  className={`
                    cursor-pointer p-2 rounded-md transition-all duration-300 ease-in-out
                    ${
                      selectedButton === btn.name
                        ? "bg-gray-600 scale-105 shadow-lg ring-2 ring-blue-500"
                        : "bg-gray-700 hover:bg-gray-600 hover:scale-100"
                    }
                    flex items-center justify-center
                    w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                  `}
                >
                  <Image
                    src={btn.icon}
                    alt={`${btn.label} logo`}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 40px, (max-width: 1024px) 60px, 80px"
                    className={`
                      w-auto h-full max-h-[80%]
                      transition-transform duration-300
                      ${
                        selectedButton === btn.name
                          ? "rotate-12"
                          : "hover:rotate-6"
                      }
                    `}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
          {/* Card Container */}
          <div className="w-full h-auto min-h-[20rem] md:h-[32rem] shadow-xl/30 flex flex-col p-2 md:p-6 items-center justify-center bg-gray-700 rounded-lg">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-200">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-4 text-red-400">
                <Image
                  src="/images/file.svg"
                  alt="Error icon"
                  width={48}
                  height={48}
                />
                <p>{error}</p>
                <p>Try Again</p>
                <button
                  onClick={() => setError(null)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Try Again
                </button>
              </div>
            ) : !selectedButton ? (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/images/icons8-padlock.svg"
                  alt="Lock icon"
                  width={80}
                  height={80}
                  className="opacity-50"
                />
                <p className="text-gray-200 text-lg">Select a topic to start</p>
              </div>
            ) : !gameStarted ? (
              <div className="flex flex-col items-center gap-6">
                <Image
                  src={selectedButtonData?.icon || ""}
                  alt={`${selectedButtonData?.label} logo`}
                  width={120}
                  height={120}
                  className="animate-pulse"
                />
                <p className="text-gray-200 text-lg">
                  Selected topic: {selectedButtonData?.label}
                </p>
                <button
                  onClick={startGame}
                  disabled={availableQuestions.length === 0}
                  className={`px-6 py-2 cursor-pointer ${
                    availableQuestions.length === 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white rounded-md transition-colors duration-300`}
                >
                  {availableQuestions.length === 0
                    ? "No questions available"
                    : "Start"}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Pokemon Card */}
                <div
                  className={`relative w-full md:w-2/4 h-3/4 max-w-md aspect-[2/3] rounded-xl shadow-xl/30 ${selectedButtonData?.color} ${selectedButtonData?.borderColor} flex flex-col`}
                >
                  {/* Index */}
                  <div className="absolute top-1 left-1 w-10 h-10 rounded-full bg-white border-2 border-gray-800 flex items-center justify-center">
                    <span className="font-bold text-gray-800">
                      {questionIndex}
                    </span>
                  </div>
                  {/* Languaje Logo*/}
                  <div className="flex justify-center py-4 bg-white rounded-t-xl mb-2 p-4">
                    <Image
                      src={selectedButtonData?.icon || ""}
                      alt={`${selectedButtonData?.label} logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  {/* Question */}
                  <div className="flex items-center justify-center mt-4 px-2">
                    <p
                      className={`text-center text-lg md:text-xl font-medium ${selectedButtonData?.textColor}`}
                    >
                      {currentQuestion?.question || "No question available"}
                    </p>
                  </div>
                  {/* Show-Hide answer */}
                  {showAnswer && (
                    <div
                      className={`mt-auto p-4 rounded-b-xl bg-white bg-opacity-20 ${selectedButtonData?.textColor}`}
                    >
                      <p className="text-center text-sm font-medium text-gray-800">
                        {currentQuestion?.answer || "No answer available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* card controls */}
            {gameStarted && (
              <div className="flex justify-between w-full px-4 mt-4">
                <button
                  onClick={toggleAnswer}
                  disabled={!currentQuestion}
                  className={`px-4 py-2 cursor-pointer ${
                    !currentQuestion
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-md transition-colors duration-300`}
                >
                  {showAnswer ? "Hide" : "Show"} Answer
                </button>
                <button
                  onClick={nextCard}
                  disabled={availableQuestions.length === 0}
                  className={`px-4 py-2 cursor-pointer ${
                    availableQuestions.length === 0
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white rounded-md transition-colors duration-300`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Second container */}
          <div className="w-full h-auto min-h-[20rem] md:h-[32rem] shadow-xl/30 flex flex-col p-2 md:p-6 gap-2 md:gap-4 items-center justify-center bg-gray-700 rounded-lg">
            {!selectedButton ? (
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/images/icons8-deepseek-480.svg"
                  alt="Deepseek logo"
                  width={80}
                  height={80}
                  className="opacity-70"
                />
                <p className="text-gray-400 text-sm md:text-lg text-center">
                  Select a topic to start
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="flex flex-col items-center gap-2 md:gap-4">
                  <Image
                    src="/images/icons8-deepseek-480.svg"
                    alt="Deepseek logo"
                    width={60}
                    height={60}
                    className={`opacity-90 ${
                      isAiLoading ? "animate-pulse" : ""
                    }`}
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-200">
                    AI Assistant
                  </h3>
                </div>

                {/* Answer container */}
                <div className="flex-1 w-full overflow-y-auto my-2 md:my-4 max-h-[12rem] md:max-h-none">
                  {aiError ? (
                    <div className="text-red-400 text-center p-2 md:p-4 text-sm md:text-base flex flex-col gap-4 items-center justify-center">
                      <Image
                        src="/images/crying-face-svgrepo-com.svg"
                        alt="Error icon"
                        width={80}
                        height={80}
                      />
                      <p>{aiError}</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4 h-full overflow-auto">
                      <p className="text-gray-200 whitespace-pre-wrap text-sm md:text-base">
                        {aiResponse}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8 items-center justify-center h-full p-4">
                      {gameStarted ? (
                        <>
                          {isAiLoading ? (
                            <Image
                              src="/images/cogwheel-svgrepo-com.svg"
                              alt="Deepseek logo"
                              width={50}
                              height={50}
                              className="opacity-50 animate-spin"
                            />
                          ) : (
                            <></>
                          )}
                          <p className="text-gray-400 text-center text-sm md:text-base">
                            Go deeper into the answer
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-center text-sm md:text-base">
                          Start the game to use AI assistant
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {gameStarted && (
                  <button
                    onClick={handleAiExplanation}
                    disabled={!currentQuestion || isAiLoading}
                    className={`cursor-pointer mt-auto px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base ${
                      !currentQuestion || isAiLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-colors`}
                  >
                    {isAiLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>Generating</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Dive Deeper"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
