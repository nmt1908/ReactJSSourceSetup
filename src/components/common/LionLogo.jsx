import { cn } from "@/lib/utils";

const LionLogo = ({ className }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-8 w-8 text-primary", className)}
        >
            {/* Geometric LEO Lion Head */}
            <path
                d="M50 10L65 25L85 20L80 45L95 60L75 70L80 90L50 80L20 90L25 70L5 60L20 45L15 20L35 25L50 10Z"
                fill="currentColor"
                className="opacity-20"
            />
            <path
                d="M50 25L60 40H40L50 25Z"
                fill="currentColor"
            />
            <path
                d="M35 45L45 55L35 65"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M65 45L55 55L65 65"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M40 70C40 70 45 75 50 75C55 75 60 70 60 70"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M50 10V25M25 25L35 35M75 25L65 35M15 50H25M85 50H75M25 75L35 65M75 75L65 65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
};

export default LionLogo;
