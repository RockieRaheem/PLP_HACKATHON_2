import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const FlutterwavePayment = ({ 
  amount, 
  email, 
  phone, 
  name, 
  planId, 
  onSuccess, 
  onClose 
}) => {
  const config = {
    public_key: '4bb74228-6047-4422-96d8-6738d3d9fd2a', // Client ID as public key
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'KES',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: phone,
      name: name,
    },
    customizations: {
      title: 'EduAid Premium Subscription',
      description: `Payment for ${planId} plan`,
      logo: 'https://eduaid-bot.web.app/logo192.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const initiatePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log('Flutterwave Response:', response);
        if (response.status === 'successful') {
          // Call success callback
          if (onSuccess) {
            onSuccess(response);
          }
        }
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {
        console.log('Payment modal closed');
        if (onClose) {
          onClose();
        }
      },
    });
  };

  return (
    <button 
      onClick={initiatePayment}
      className="flutterwave-payment-btn"
      style={{
        backgroundColor: '#f5a623',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        marginTop: '16px',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#e89611'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#f5a623'}
    >
      Pay with Flutterwave
    </button>
  );
};

export default FlutterwavePayment;
