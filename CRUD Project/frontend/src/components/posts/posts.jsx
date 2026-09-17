import Post from "../post/post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: userId ? ["posts", userId] : ["posts"],
    queryFn: async () => {
      const res = await makeRequest.get(
        userId ? "/posts?userId=" + userId : "/posts"
      );
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="posts">
      {data?.map((post) => (
        <Post key={post.postId || `${post.id}-${post.userId}`} post={post} />
      ))}
    </div>
  );
};

export default Posts;
