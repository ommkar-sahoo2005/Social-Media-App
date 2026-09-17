import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ---------- FETCH COMMENTS ----------
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await makeRequest.get("/comments?postId=" + postId);
      return res.data;
    },
    enabled: !!postId,
  });

  // ---------- ADD COMMENT ----------
  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),

    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data?.map((comment) => (
            <div className="comment" key={comment.commentId || comment.id}>
              <img src={"/upload/" + comment.profilePic} alt="" />

              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>

              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
