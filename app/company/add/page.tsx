"use client";

import { useCompanies } from "@/context/CompaniesContext";
import CompanyForm from "@/components/CompanyForm";
import { Company } from "@/lib/types";

export default function AddCompany() {
  const { addCompany } = useCompanies();

  const handleSubmit = (data: Omit<Company, "id" | "unread">) => {
    addCompany(data);
  };

  return <CompanyForm title="企業を追加" onSubmit={handleSubmit} />;
}
