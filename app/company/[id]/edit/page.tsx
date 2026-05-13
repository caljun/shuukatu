"use client";

import { useParams } from "next/navigation";
import { useCompanies } from "@/context/CompaniesContext";
import CompanyForm from "@/components/CompanyForm";
import { Company } from "@/lib/types";

export default function EditCompany() {
  const params = useParams();
  const id = params.id as string;
  const { getCompany, updateCompany } = useCompanies();

  const company = getCompany(id);

  if (!company) {
    return (
      <div className="p-8 text-center text-slate-400 mt-20">
        企業が見つかりませんでした。
      </div>
    );
  }

  const handleSubmit = (data: Omit<Company, "id" | "unread">) => {
    updateCompany(id, data);
  };

  return (
    <CompanyForm
      title="企業を編集"
      initialData={{
        name: company.name,
        genre: company.genre,
        deadline: company.deadline,
        loginId: company.loginId,
        mypageUrl: company.mypageUrl,
        memo: company.memo,
      }}
      onSubmit={handleSubmit}
    />
  );
}
