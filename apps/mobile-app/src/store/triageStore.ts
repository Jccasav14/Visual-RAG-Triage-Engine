import { create } from 'zustand';

interface TriageState {
  tickets: any[];
  addTicket: (t: any) => void;
}

export const useTriageStore = create<TriageState>((set) => ({
  tickets: [],
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
}));
