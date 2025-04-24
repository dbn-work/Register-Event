export const isTokenValid = async () => {
    const token = localStorage.getItem("token"); // Use the same key as everywhere else
    if (!token) return false;
    try 
     {
      const res = await fetch("http://localhost:5000/api/admin/protected", {
        headers: { Authorization: `Bearer ${token}` },
     });
      return res.ok;
    } catch {
      return false;
    }
};
