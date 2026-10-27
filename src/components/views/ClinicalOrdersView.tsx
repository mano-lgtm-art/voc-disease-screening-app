import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  Send,
  XCircle,
  ExternalLink,
  Printer
} from 'lucide-react';
import { ClinicalOrder } from '../../types/clinical';

interface ClinicalOrdersViewProps {
  orders: ClinicalOrder[];
  onOpenOrderModal: () => void;
  onUpdateOrderStatus: (orderId: string, status: ClinicalOrder['status']) => void;
}

export const ClinicalOrdersView: React.FC<ClinicalOrdersViewProps> = ({
  orders,
  onOpenOrderModal,
  onUpdateOrderStatus,
}) => {
  const [filterPriority, setFilterPriority] = useState<'All' | 'STAT' | 'Urgent' | 'Routine'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesPriority = filterPriority === 'All' || order.priority === filterPriority;
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clinical Orders & Interventional Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pharmacy dispensing, stat laboratory requisitions, and procedural orders
          </p>
        </div>

        <button
          onClick={onOpenOrderModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Stat Order</span>
        </button>
      </div>

      {/* Orders Filter & Search Toolbar */}
      <div className="glass-panel-1 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search orders, meds, patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194]"
            />
          </div>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            {(['All', 'STAT', 'Urgent', 'Routine'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterPriority === p
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredOrders.length} active orders
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const isStat = order.priority === 'STAT';
          const isCompleted = order.status === 'Completed';

          return (
            <div
              key={order.id}
              className={`p-4 rounded-xl border transition-all glass-panel-1 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted ? 'opacity-60 bg-slate-50/50' : 'hover:border-sky-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      isStat
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {order.priority}
                  </span>
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">
                    {order.type}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-slate-700 font-medium">{order.bed}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-slate-900">{order.patientName}</span>
                </div>

                <h2 className="text-base font-bold text-slate-900">
                  {order.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {order.instructions}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                  <span>Ordered by: <strong>{order.orderedBy}</strong></span>
                  <span>·</span>
                  <span>Time: <strong>{order.orderedAt}</strong></span>
                  <span>·</span>
                  <span>Status: <strong className={isCompleted ? 'text-emerald-600' : 'text-[#006194]'}>{order.status}</strong></span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {order.status !== 'Completed' ? (
                  <button
                    onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Administered</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                )}

                <button
                  onClick={() => alert(`Transmitting requisition for Order ${order.id} to hospital dispatch system.`)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Print / Requisition"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
