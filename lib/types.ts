export type Genre = "SIer" | "エンタメ" | "";
export type CompanyColor = "white" | "blue" | "red" | "purple" | "black";

export interface Company {
  id: string;
  name: string;
  genre: Genre;
  deadline: string;
  memo: string;
  mypageUrl: string;
  loginId: string;
  unread: number;
  color?: CompanyColor;
}

export interface CompanyEvent {
  id: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  title: string;
}
