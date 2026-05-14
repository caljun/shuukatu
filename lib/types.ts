export type Genre = "SIer" | "エンタメ" | "";

export interface Company {
  id: string;
  name: string;
  genre: Genre;
  deadline: string;
  memo: string;
  mypageUrl: string;
  loginId: string;
  unread: number;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  title: string;
}
