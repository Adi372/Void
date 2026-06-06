import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [chosen, setChosen] = useState([]);

  const categories = [
    "Technology",
    "Music",
    "Sports",
    "Gaming",
    "Travel",
    "Movies & TV",
    "Fitness",
    "Photography",
    "Food",
    "Fashion",
    "Art & Design",
    "Business",
    "Education",
    "Science",
    "Books",
    "Lifestyle",
    "Creators",
    "Anime",
    "Memes",
    "News",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/findUser", {
        withCredentials: true,
      })
      .then((res) => {
        const user = res.data;

        setFirstName(user.fullName?.firstName || "");
        setLastName(user.fullName?.lastName || "");
        setEmail(user.email || "");

        setChosen(user.interests || []);

        if (user.profilePic) {
          setImagePreview(user.profilePic);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleInterest = (interest) => {
    setChosen((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);

      if (image instanceof File) {
        formData.append("image", image);
      }

      formData.append("interests", JSON.stringify(chosen));

      await axios.post(
        "http://localhost:3000/api/user/updateProfile",
        formData,
        {
          withCredentials: true,
        }
      );

      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-6 flex justify-center">
        <h1 className="text-4xl font-semibold">Edit Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-10 px-6 pb-10"
      >
        <div className="flex justify-center">
          <label className="h-40 w-40 rounded-full border overflow-hidden cursor-pointer">
            {!imagePreview ? (
              <div className="h-full w-full flex items-center justify-center text-[170px]">
                <i className="ri-user-line"></i>
              </div>
            ) : (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="flex gap-8 flex-wrap justify-center">
          <div className="flex flex-col gap-2">
            <label>First Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-70"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Last Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-70"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              className="border rounded px-3 py-2 w-70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-6xl">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => toggleInterest(cat)}
              className={`px-6 py-3 rounded border transition cursor-pointer
                ${
                  chosen.includes(cat)
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate("/profile")} className="border px-6 py-2 rounded">
            Cancel
          </button>

          <button type="submit" className="border px-6 py-2 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;