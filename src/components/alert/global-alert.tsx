import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

type Props = {
    message: string;
    type: "success" | "warning" | "error";
};

export default function GlobalAlert({ message, type }: Props) {
    const iconMap = {
        success: <CheckCircle className="text-green-600" />,
        warning: <AlertTriangle className="text-yellow-500" />,
        error: <AlertCircle className="text-red-600" />,
    };

    const colorMap = {
        success: "bg-green-100 border-green-500 text-green-800",
        warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
        error: "bg-red-100 border-red-500 text-red-800",
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <Alert className={`w-full max-w-sm border ${colorMap[type]}`}>
                {iconMap[type]}
                <AlertDescription className="ml-2">{message}</AlertDescription>
            </Alert>
        </div>
    );
}
