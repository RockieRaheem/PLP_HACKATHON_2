import React from 'react';

const FlutterwavePayment = ({ 
  amount, 
  email, 
  phone, 
  name, 
  planId, 
  onSuccess, 
  onClose 
}) => {
  const initiatePayment = () => {
    // Mock payment for demo purposes
    console.log('Initiating payment for:', {
      amount,
      email,
      phone,
      name,
      planId
    });

    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      const mockResponse = {
        status: 'successful',
        tx_ref: `eduaid_${planId}_${Date.now()}`,
        flw_ref: `flw_${Date.now()}`,
        transaction_id: Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: 'KES',
        customer: {
          email,
          phone_number: phone,
          name
        }
      };

      console.log('Mock payment successful:', mockResponse);
      
      if (onSuccess) {
        onSuccess(mockResponse);
      }
    }, 2000);
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
      Pay KES {amount} - Demo Mode
    </button>
  );
};

export default FlutterwavePayment;
