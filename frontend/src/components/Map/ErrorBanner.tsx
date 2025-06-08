type Props = {
    message: string;
};

const ErrorBanner: React.FC<Props> = ({ message }) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-md shadow-md z-[2000]">
            {message}
        </div>
    );
};

export default ErrorBanner;
