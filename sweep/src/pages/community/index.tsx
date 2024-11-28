import { PostCreate } from "./PostCreate/PostCreate";
import { PostDetail } from "./PostDetail/PostDetail";
import { PostList } from "./PostList/PostList";

function Dugout() {
  return <PostList mode="덕아웃" />;
}

function Draft() {
  return <PostList mode="드래프트" />;
}

function Market() {
  return <PostList mode="마켓" />;
}

export { Dugout, Draft, Market, PostCreate, PostDetail };
