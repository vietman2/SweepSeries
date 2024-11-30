import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { TermsCreate } from "./TermsCreate/TermsCreate";
import { TermsDetail } from "./TermsDetail/TermsDetail";
import { TermsList } from "./TermsList/TermsList";
import { SimpleModal } from "@components/Modals";

function TermsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/apps/terms/") &&
    location.pathname !== "/apps/terms";

  const closeModal = () => navigate("/apps/terms");

  return (
    <>
      <TermsList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { TermsCreate, TermsDetail, TermsLayout };
