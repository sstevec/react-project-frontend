"use client";

import React, {createContext, ReactNode, useContext, useState} from "react";
import GlobalAlert from "@/components/alert/global-alert";

type AlertType = "success" | "warning" | "error";

interface AlertContextType {
    showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({children}: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<AlertType>("success");

    const showAlert = (msg: string, alertType: AlertType) => {
        setMessage(msg);
        setType(alertType);
        setVisible(true);

        setTimeout(() => setVisible(false), 3000);
    };

    return (
        <AlertContext.Provider value={{showAlert}}>
            {children}
            {visible && <GlobalAlert message={message} type={type}/>}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}
