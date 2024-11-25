import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { UserDetail } from "./UserDetail/UserDetail";
import { UserList } from "./UserList/UserList";
import { SimpleModal } from "@components/Modals";

function UsersLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isModalOpen =
    location.pathname.includes("/members/users/") &&
    location.pathname !== "/members/users";

  const closeModal = () => navigate("/members/users");

  return (
    <>
      <UserList />
      <SimpleModal isOpen={isModalOpen} onClose={closeModal}>
        <Outlet />
      </SimpleModal>
    </>
  );
}

export { UserDetail, UsersLayout };
