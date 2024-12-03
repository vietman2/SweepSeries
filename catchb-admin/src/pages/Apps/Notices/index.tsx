import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { NoticeDetail } from "./NoticeDetail/NoticeDetail";
import { NoticesList } from "./NoticesList/NoticesList";
import { NoticeWrite } from "./NoticeWrite/NoticeWrite";
import { SimpleModal } from "@components/Modals";

function NoticesLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/apps/notices/") &&
    location.pathname !== "/apps/notices";

  const closeModal = () => navigate("/apps/notices");

  return (
    <>
      <NoticesList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { NoticeDetail, NoticesLayout, NoticeWrite };
