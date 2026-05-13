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
