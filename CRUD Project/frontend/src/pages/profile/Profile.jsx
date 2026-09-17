import "./Profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Update from "../../components/update/Update";
import Posts from "../../components/posts/posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { id } = useParams();
  const userId = Number(id);

  // ---------------- USER DATA ----------------
  const {
    isLoading,
    isError,
    error,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${userId}`);
      return res.data;
    },
    enabled: !!userId,
    retry: false,
  });

  // ---------------- RELATIONSHIPS DATA ----------------
  const { data: relationshipData = [] } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: async () => {
      const res = await makeRequest.get(
        `/relationships?followedUserId=${userId}`
      );

      // force numbers to avoid includes() mismatch
      return res.data.map((id) => Number(id));
    },
    enabled: !!userId,
  });

  const isFollowing = relationshipData.includes(currentUser.id);

  // ---------------- FOLLOW / UNFOLLOW ----------------
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) {
        return makeRequest.delete(`/relationships?userId=${userId}`);
      } else {
        return makeRequest.post("/relationships", { userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationship", userId],
      });
    },
  });

  const handleFollow = () => {
    mutation.mutate(isFollowing);
  };

  // ---------------- UI ----------------
  if (isLoading) return <div className="profile">Loading...</div>;
  if (isError) return <div className="profile">Error: {error?.message}</div>;

  return (
    <div className="profile">
      <div className="images">
        <img src={"/upload/" + userData?.coverPic} alt="" className="cover" />
        <img
          src={"/upload/" + userData?.profilePic}
          alt=""
          className="profilePic"
        />
      </div>

      <div className="profileContainer">
        <div className="userInfo">
          <div className="left">
            <a href="https://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="https://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="https://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="https://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="https://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>

          <div className="center">
            <span>{userData?.name}</span>

            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{userData?.city}</span>
              </div>

              <div className="item">
                <LanguageIcon />
                <span>{userData?.website}</span>
              </div>

              {userId === currentUser?.id ? (
                <button onClick={() => setOpenUpdate(true)}>Update</button>
              ) : (
                <button onClick={handleFollow} disabled={mutation.isLoading}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      </div>
      <Posts userId={userId} />
      {openUpdate && <Update setUpdateOpen={setOpenUpdate} user={userData} />}
    </div>
  );
};

export default Profile;
