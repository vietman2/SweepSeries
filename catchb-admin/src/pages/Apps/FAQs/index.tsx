import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { FAQCreate } from "./FAQCreate/FAQCreate";
import { FAQDetail } from "./FAQDetail/FAQDetail";
import { FAQsList } from "./FAQsList/FAQsList";
import { SimpleModal } from "@components/Modals";

function FAQsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/apps/faqs/") &&
    location.pathname !== "/apps/faqs";

  const closeModal = () => navigate("/apps/faqs");

  return (
    <>
      <FAQsList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { FAQCreate, FAQDetail, FAQsLayout };
