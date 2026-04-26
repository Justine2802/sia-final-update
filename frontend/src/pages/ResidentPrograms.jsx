import React, { useState } from 'react';
import { BookOpen, CreditCard, Loader2 } from 'lucide-react';
import Alert from '@/components/Alert';

function ResidentPrograms() {
  const [submitting, setSubmitting] = useState(null);
  // Example data - replace with your fetchPrograms logic
  const programs = [
    { id: 1, program_name: 'Rice Distribution', amount: 50, description: 'Monthly rice subsidy for qualified residents.' },
    { id: 2, program_name: 'TUPAD', amount: 150, description: 'Emergency employment program for displaced workers.' }
  ];

  const handlePayment = (programName, amount) => {
    setSubmitting(programName);
    
    // Create a form to post to Laravel (Avoids CORS issues)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8000/payment/start'; // Your Laravel Backend URL

    const nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = 'program_name';
    nameInput.value = programName;
    form.appendChild(nameInput);

    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = amount;
    form.appendChild(amountInput);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-900">Available Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <BookOpen size={24} />
              </div>
              <span className="text-lg font-black text-gray-900">₱{prog.amount}.00</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{prog.program_name}</h3>
            <p className="text-gray-500 text-sm mb-8 flex-1">{prog.description}</p>

            <button
              onClick={() => handlePayment(prog.program_name, prog.amount)}
              disabled={submitting === prog.program_name}
              className="flex items-center justify-center gap-2 w-full bg-[#0f172a] hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-lg"
            >
              {submitting === prog.program_name ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
              PAY & ENROLL NOW
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResidentPrograms;
