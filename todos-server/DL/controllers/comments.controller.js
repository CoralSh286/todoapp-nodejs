/** @format */

const pool = require("../db"); // Adjust path to your db.js file
// CRUD
async function create({ postId, name, email, body }) {
  try {
    const query =
      "INSERT INTO comments ( post_id, name, email, body) VALUES (?, ?, ?, ?)";
    const [result] = await pool.execute(query, [postId, name, email, body]);

    return {
      success: true,
      id: result.insertId,
      message: "comment created successfully",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}
async function readMany({ postId, title }) {
  try {
    let query = "SELECT * FROM comments WHERE post_id = ?";
    let params = [postId];

    // מערך של תנאים נוספים
    const conditions = [];

    if (title && title.trim() !== "") {
      conditions.push("title LIKE ?");
      params.push(`%${title}%`);
    }

    // הוספת כל התנאים לשאילתה
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    const [result] = await pool.execute(query, params);

    return {
      success: true,
      data: result,
      message: "posts tasks loaded successfully",
    };
  } catch (error) {
    throw new Error("Failed to read comments: " + error.message);
  }
}

async function update(data) {
  const { id, name, email, body } = data;
   let checkQuery = "SELECT * FROM comments WHERE id = ?";
  let checkParams = [id];
  
  try {
    const existingComment = await pool.query(checkQuery, checkParams);
    if (!existingComment || existingComment.length === 0) {
      throw new Error("Comment not found or access denied");
    }

    // Build the update query dynamically
    const updateFields = [];
    const updateParams = [];

    if (name !== undefined && name !== null) {
      updateFields.push("name = ?");
      updateParams.push(name);
    }
    
    if (body !== undefined && body !== null) {
      updateFields.push("body = ?");
      updateParams.push(body);
    }

    if (email !== undefined && email !== null) {
      updateFields.push("email = ?");
      updateParams.push(email);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }
 
    let updateQuery = `UPDATE comments SET ${updateFields.join(", ")} WHERE id = ?`;
    updateParams.push(id);

    // Execute the update
    const result = await pool.query(updateQuery, updateParams);
    
    if (result.affectedRows === 0) {
      throw new Error("Todo not found or no changes made");
    }

    // Return the updated todo
    const updatedTodo = await pool.query("SELECT * FROM comments WHERE id = ?", [id]);
    return updatedTodo[0];
    
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}
async function deleteById(id) {
  try {
    const query = "DELETE FROM comments WHERE id = ?";
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      throw new Error("Comment not found or already deleted");
    }

    return {
      success: true,
      message: "comment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }

}

module.exports = { create,  readMany, update, deleteById };
