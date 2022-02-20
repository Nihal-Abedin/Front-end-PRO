
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Success_Toast = (msg) => {
    toast.configure();
    return toast.success(`${msg}`, {
        position: toast.POSITION.TOP_RIGHT, style: {
            width: "fit-content",
            fontSize: "1.5rem",
            color: "#33FF75",
            fontWeight: "bold"

        }
    })
};
export const Error_Toast = (msg) => {
    toast.configure();
    return toast.error(`${msg}`, {
        position: toast.POSITION.TOP_RIGHT, style: {
            width: "fit-content",
            fontSize: "1.5rem",
            color: "#FB373F",
            fontWeight: "bold"

        }
    })
}