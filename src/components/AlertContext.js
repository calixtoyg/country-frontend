import React, {createContext, useState} from "react";

export const AlertMessageContext = createContext({open: false, type: 'success'})

export function AlertContext({children}) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [type, setType] = useState('success');
    const [message, setMessage] = useState('Default message');

    return (
        <AlertMessageContext.Provider value={{ alertOpen, type, message, setAlertOpen, setType, setMessage}}>
            {children}
        </AlertMessageContext.Provider>
    )

}
