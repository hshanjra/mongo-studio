import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`
        flex items-center justify-center 
        ${fullScreen ? "fixed inset-0 bg-opacity-50 bg-gray-100 z-50" : ""}
      `}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className="
            w-16 h-16 
            border-4 border-t-4 
            border-gray-200 border-t-blue-500 
            rounded-full 
            animate-spin
          "
        />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export const FullScreenLoading: React.FC<{ message?: string }> = ({
  message,
}) => <Loading fullScreen message={message} />;

export default Loading;
