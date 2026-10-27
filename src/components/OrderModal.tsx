import React, { useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';
import { Patient, ClinicalOrder } from '../types/clinical';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  selectedPatientId: string;
  onAddOrder: (order: Partial<ClinicalOrder>) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  patients,
  selectedPatientId,
  onAddOrder,
}) => {
  const [patientId, setPatientId] = useState(selectedPatientId);
  const [orderTitle, setOrderTitle] = useState('');
  const [orderType, setOrderType] = useState<ClinicalOrder['type']>('Medication');
  const [priority, setPriority] = useState<ClinicalOrder['priority']>('STAT');
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const currentPatient = patients.find((p) => p.id === patientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTitle.trim()) return;

    onAddOrder({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      bed: currentPatient.bed,
      title: orderTitle,
      type: orderType,
      priority: priority,
      status: 'Authorized',
      orderedBy: 'Dr. Sarah Chen, MD',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      instructions: instructions || 'Administer per critical care protocol with telemetry monitoring.',
    });

    onClose();
    setOrderTitle('');
    setInstructions('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Create Clinical Order & Intervention
            </h3>
            <p className="text-xs text-slate-500">
              Direct entry for pharmacy, stat labs, or diagnostic procedures
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Patient & Bed</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.bed} · {p.name} ({p.mrn}) · {p.primaryDiagnosis}
                </option>
              ))}
            </select>
          </div>

          {/* Order Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Intervention / Medication Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Norepinephrine titration, Arterial Blood Gas, TTE"
              value={orderTitle}
              onChange={(e) => setOrderTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194]"
            />
          </div>

          {/* Type & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as ClinicalOrder['type'])}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20"
              >
                <option value="Medication">Medication</option>
                <option value="Stat Lab">Stat Lab</option>
                <option value="Diagnostic Imaging">Diagnostic Imaging</option>
                <option value="Nursing Procedure">Nursing Procedure</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Acuity / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ClinicalOrder['priority'])}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20"
              >
                <option value="STAT">STAT (Immediate dispatch)</option>
                <option value="Urgent">Urgent (&lt; 1 hour)</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
          </div>

          {/* Specific Clinical Instructions */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Dosage & Administration Instructions</label>
            <textarea
              rows={3}
              placeholder="Enter titration ranges, routes, or nursing precautions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194]"
            />
          </div>

          {/* Attestation disclaimer */}
          <div className="p-3 bg-sky-50 rounded-lg text-slate-600 border border-sky-100 flex items-start gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#006194] shrink-0 mt-0.5" />
            <span>
              Orders signed and dispatched under attending intensivist license with instant Pyxis and EHR integration.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Authorize & Transmit Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
