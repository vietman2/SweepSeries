import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { TagDetail } from "./TagDetail/TagDetail";
import { TagList } from "./TagList/TagList";
import { TagWrite } from "./TagWrite/TagWrite";
import { SimpleModal } from "@components/Modals";

function TagsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/community/tags/") &&
    location.pathname !== "/community/tags";

  const closeModal = () => navigate("/community/tags");

  return (
    <>
      <TagList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { TagDetail, TagsLayout, TagWrite };
