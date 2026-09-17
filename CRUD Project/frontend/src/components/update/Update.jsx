import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setUpdateOpen, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser) =>
      makeRequest.put(`/users/${user.id}`, updatedUser),

    onSuccess: () => {
      queryClient.invalidateQueries(["user"]); // profile page
      queryClient.invalidateQueries(["posts"]); // feed + user posts
      queryClient.invalidateQueries(["comments"]); // comments avatars
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();

    const coverUrl = cover ? await upload(cover) : user.coverPic;
    const profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });

    setUpdateOpen(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>

        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />

            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>

          <label>Email</label>
          <input name="email" value={texts.email} onChange={handleChange} />

          <label>Password</label>
          <input
            name="password"
            value={texts.password}
            onChange={handleChange}
          />

          <label>Name</label>
          <input name="name" value={texts.name} onChange={handleChange} />

          <label>Country / City</label>
          <input name="city" value={texts.city} onChange={handleChange} />

          <label>Website</label>
          <input name="website" value={texts.website} onChange={handleChange} />

          <button onClick={handleClick}>Update</button>
        </form>

        <button className="close" onClick={() => setUpdateOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;
