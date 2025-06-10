/** @format */

import React, { useEffect, useState } from "react";
import { Await, useParams, useSearchParams } from "react-router-dom";
import { apiRequest, useApiRequest } from "../../service/api";
import DisplayData from "../../components/DisplayData/DisplayData";
import Comment from "../../components/Comment/Comment";
import "./style.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import CrudBar from "../../components/CrudBar/CrudBar";

export default function CommentsPage() {
  const [searchParams] = useSearchParams();
  const { postId } = useParams();
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const { data, loading, error, refetch } = useApiRequest({
    url: `/comments?postId=${postId}`,
    initialData: [],
  });

  useEffect(() => {
    if (data.data) {
      setComments(data.data);
    }
  }, [data.data]);

  const onDelete = async () => {
    if (!selected) return;
    const { id } = selected; 
    await apiRequest({ url: `/comments/delete-comment/${id}`, method: "DELETE" }); 
    setComments(comments.filter((comment) => comment.id !== id));
    setSelected(null); 
    await refetch();
  };

  return (
    <div className="comments-page">
      <PageHeader title={`Comments for Post #${postId}`} />
      <CrudBar
        additionalData={{ postId }}
        refetchFunction={refetch}
        editingFor="comments"
        selected={selected}
        onDelete={onDelete}
      />
      <DisplayData error={error} loading={loading} data={comments}>
        <div className="comments-container">
          {comments.map((comment) => (
            <Comment
              selected={selected}
              setSelected={setSelected}
              data={comment}
              key={comment.id}
            />
          ))}
        </div>
      </DisplayData>
    </div>
  );
}
