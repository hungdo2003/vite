import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Attempt to close the page after 2 seconds
        const timer = setTimeout(() => {
            window.close();
        }, 2000);

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, []);

    const handleClose = () => {
        window.close();
    };

    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const amount = query.get('amount');
    const date = query.get('date');
    const transactionNo = query.get('transactionNo');

    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment Successful!</h1>
            <p style={styles.message}>Thank you for your payment. Your order has been processed successfully.</p>

            <div style={styles.orderSummary}>
                <h2>Order Summary</h2>
                <p><strong>Transaction ID:</strong> {transactionNo}</p>
                <p><strong>Amount:</strong> {amount}</p>
                <p><strong>Date:</strong> {year}/{month}/{day}</p>
            </div>

            <button style={styles.button} onClick={handleClose}>
                Close
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        color: '#28a745',
    },
    message: {
        fontSize: '1.2rem',
        margin: '10px 0',
    },
    orderSummary: {
        margin: '20px 0',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default PaymentSuccess;
