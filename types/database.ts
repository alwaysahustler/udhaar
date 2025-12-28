export type UUID = string;

export interface ProfilesRow {
  id: UUID;
  full_name: string | null;
  upi_id: string | null;
  avatar_url: string | null;
}

export interface GroupsRow {
  id: UUID;
  name: string;
  created_by: UUID;
}

export interface ExpensesRow {
  id: UUID;
  group_id: UUID;
  paid_by: UUID;
  amount: string;
  description: string | null;
}

export interface SplitsRow {
  id: UUID;
  expense_id: UUID;
  user_id: UUID;
  amount_owed: string;
  is_settled: boolean;
}

export interface GroupMembersRow {
  id: UUID;
  group_id: UUID;
  user_id: UUID;
  joined_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: Omit<ProfilesRow, 'id'> & { id?: UUID };
        Update: Partial<Omit<ProfilesRow, 'id'>>;
      };
      groups: {
        Row: GroupsRow;
        Insert: Omit<GroupsRow, 'id'> & { id?: UUID };
        Update: Partial<Omit<GroupsRow, 'id'>>;
      };
      expenses: {
        Row: ExpensesRow;
        Insert: Omit<ExpensesRow, 'id'> & { id?: UUID };
        Update: Partial<Omit<ExpensesRow, 'id'>>;
      };
      splits: {
        Row: SplitsRow;
        Insert: Omit<SplitsRow, 'id'> & { id?: UUID };
        Update: Partial<Omit<SplitsRow, 'id'>>;
      };
      group_members: {
        Row: GroupMembersRow;
        Insert: Omit<GroupMembersRow, 'id' | 'joined_at'> & { id?: UUID; joined_at?: string };
        Update: Partial<Omit<GroupMembersRow, 'id' | 'joined_at'>>;
      };
    };
  };
}


