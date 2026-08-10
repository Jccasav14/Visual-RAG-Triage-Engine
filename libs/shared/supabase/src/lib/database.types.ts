export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string | null; role: string; created_at: string; updated_at: string };
      };
      triage_records: {
        Row: { ticket_id: string; user_id: string; image_url: string; context_id: string; severity: string; status: string };
      };
    };
  };
}
