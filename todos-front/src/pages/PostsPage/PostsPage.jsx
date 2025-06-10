/** @format */

import React, { useEffect, useState } from "react";
import Post from "../../components/Post/Post";
import "./style.css";
import CrudBar from "../../components/CrudBar/CrudBar";
import { apiRequest, useApiRequest } from "../../service/api";
import DisplayData from "../../components/DisplayData/DisplayData";
import { getUserId } from "../../helper/localStorageHelper";
import PageHeader from "../../components/PageHeader/PageHeader";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); 
  const userId = getUserId();
  const { data, loading, error, refetch } = useApiRequest({
    url: `/posts?userId=${userId}`,
    initialData: [],
  });

  useEffect(() => {
    if (data) {
      setPosts(data.data || []); // Ensure we set posts to an empty array if data is undefined
    }
  }, [data]);
  const searchQuery = async (form) => {
    const urlQuery = `/posts?userId=${userId}${
      form.title ? "&title=" + form.title : ""
    }${form.id ? "&id=" + form.id : ""}`;
    const data = await apiRequest({ url: urlQuery });
    setPosts(data.data || []);
  };
  const onDelete = async () => {
    if (!selectedPost) return; // אם לא נבחרה משימה, אל תעשה כלום
    const { id } = selectedPost; // קח את ה-id של המשימה הנבחרת
    await apiRequest({ url: `/posts/delete-post/${id}`, method: "DELETE" }); // מחק את המשימה מה-API
    await refetch();
    setSelectedPost(null); // נקה את הסטייט של המשימה הנבחרת
  };
  return (
    <div className="posts-container">
      <CrudBar
        editingFor={"posts"}
        onDelete={onDelete}
        refetchFunction={refetch}
        additionalData={{ userId: userId }}
        selected={selectedPost}
      />
      <PageHeader title={"Posts"} />
      <SearchBar onSubmit={searchQuery} />
      <DisplayData error={error} loading={loading} data={posts}>
        <div className="posts-grid">
          {posts.map((post) => (
            <Post
              key={post.id}
              {...post}
              selected={selectedPost}
              setSelected={setSelectedPost}
            />
          ))}
        </div>
      </DisplayData>
    </div>
  );
}
