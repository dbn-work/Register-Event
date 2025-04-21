export const isTokenValid = async () => {
    const token = localStorage.getItem("token"); // Use the same key as everywhere else
    if (!token) return false;
    try 
     {
      const res = await fetch("https://register-event-cwsv.onrender.com/api/admin/protected", {
        headers: { Authorization: `Bearer ${token}` },
     });
      return res.ok;
    } catch {
      return false;
    }
};
