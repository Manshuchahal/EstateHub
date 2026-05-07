import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const BASE = "http://localhost:5000";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 48px", height: "64px", background: "rgba(13,13,13,0.95)",
    borderBottom: "0.5px solid rgba(201,169,110,0.15)", position: "sticky", top: 0, zIndex: 100,
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#c9a96e" },
  brandName: { fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, color: "#f5f0e8" },
  adminBadge: { fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a96e", background: "rgba(201,169,110,0.1)", border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "4px", padding: "3px 8px", marginLeft: "10px" },
  topRight: { display: "flex", alignItems: "center", gap: "16px" },
  adminName: { fontSize: "13px", color: "rgba(240,236,228,0.45)" },
  logoutBtn: { background: "none", border: "0.5px solid rgba(240,236,228,0.15)", borderRadius: "6px", padding: "7px 14px", color: "rgba(240,236,228,0.45)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  body: { display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 64px)" },
  sidebar: { padding: "32px 24px", borderRight: "0.5px solid rgba(240,236,228,0.07)", display: "flex", flexDirection: "column", gap: "6px" },
  sideLabel: { fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)", marginBottom: "12px", paddingLeft: "12px" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: active ? "#f0ece4" : "rgba(240,236,228,0.4)", background: active ? "rgba(201,169,110,0.1)" : "transparent", border: active ? "0.5px solid rgba(201,169,110,0.2)" : "0.5px solid transparent" }),
  main: { padding: "40px 48px" },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 6px" },
  pageSub: { fontSize: "13px", color: "rgba(240,236,228,0.35)", margin: "0 0 28px" },
  formWrap: { background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "12px", padding: "32px 36px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "7px" },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: "90px", transition: "border-color 0.2s" },
  uploadZone: { border: "1px dashed rgba(201,169,110,0.3)", borderRadius: "10px", padding: "28px", textAlign: "center", cursor: "pointer", background: "rgba(201,169,110,0.03)", marginBottom: "10px" },
  previewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: "8px", marginBottom: "12px" },
  previewItem: { position: "relative", borderRadius: "6px", overflow: "hidden" },
  previewImg: { width: "100%", height: "72px", objectFit: "cover", display: "block" },
  removeImg: { position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: "9px" },
  submitBtn: { background: "#c9a96e", border: "none", borderRadius: "8px", padding: "13px 24px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: "8px" },
  cancelBtn: { background: "transparent", border: "0.5px solid rgba(240,236,228,0.15)", borderRadius: "8px", padding: "13px 20px", fontSize: "13px", color: "rgba(240,236,228,0.4)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: "8px", marginLeft: "12px" },
  propRow: { background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "10px", padding: "16px 20px", display: "grid", gridTemplateColumns: "72px 1fr auto", gap: "16px", alignItems: "center", marginBottom: "10px" },
  propThumb: { width: "72px", height: "54px", objectFit: "cover", borderRadius: "6px" },
  propThumbEmpty: { width: "72px", height: "54px", borderRadius: "6px", background: "rgba(201,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  propTitle: { fontSize: "14px", fontWeight: 500, color: "#f0ece4", margin: "0 0 3px" },
  propMeta: { fontSize: "12px", color: "rgba(240,236,228,0.4)", margin: 0 },
  propPrice: { fontSize: "12px", color: "#c9a96e", margin: "3px 0 0" },
  actionBtns: { display: "flex", gap: "8px" },
  editBtn: { background: "rgba(201,169,110,0.1)", border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "6px", padding: "7px 14px", color: "#c9a96e", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  deleteBtn: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "6px", padding: "7px 14px", color: "#f59595", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  successBox: { background: "rgba(110,189,142,0.1)", border: "0.5px solid rgba(110,189,142,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#6ebd8e", marginBottom: "16px" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
  confirmOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  confirmBox: { background: "#161310", border: "0.5px solid rgba(201,169,110,0.2)", borderRadius: "14px", padding: "36px", maxWidth: "380px", width: "90%", textAlign: "center" },
  confirmTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#f5f0e8", margin: "0 0 10px" },
  confirmSub: { fontSize: "13px", color: "rgba(240,236,228,0.4)", margin: "0 0 28px", lineHeight: 1.6 },
  confirmDelete: { background: "#c0392b", border: "none", borderRadius: "8px", padding: "12px 24px", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginRight: "10px" },
  confirmCancel: { background: "transparent", border: "0.5px solid rgba(240,236,228,0.15)", borderRadius: "8px", padding: "12px 20px", color: "rgba(240,236,228,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
};

const EMPTY_FORM = { title: "", price: "", location: "", description: "" };

export default function AdminDashboard() {
  const [tab, setTab]               = useState("add");
  const [properties, setProperties] = useState([]);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [files, setFiles]           = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [editId, setEditId]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [success, setSuccess]       = useState("");
  const [error, setError]           = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { if (tab === "list") fetchProperties(); }, [tab]);

  const fetchProperties = async () => {
    setListLoading(true);
    try { const res = await API.get("/properties"); setProperties(res.data); }
    catch { /* silent */ }
    finally { setListLoading(false); }
  };

  const set   = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  const handleFiles = (selected) => {
    const combined = [...files, ...Array.from(selected)].slice(0, 15);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImg = (i) => {
    const f = files.filter((_, idx) => idx !== i);
    setFiles(f); setPreviews(f.map((fi) => URL.createObjectURL(fi)));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM); setFiles([]); setPreviews([]);
    setEditId(null); setSuccess(""); setError("");
  };

  const startEdit = (p) => {
    setForm({ title: p.title, price: String(p.price), location: p.location, description: p.description });
    setFiles([]); setPreviews([]);
    setEditId(p.id); setTab("add");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setSuccess(""); setError("");
    if (!form.title || !form.price || !form.location || !form.description) {
      setError("All fields are required."); return;
    }
    if (!editId && files.length < 3) { setError("Minimum 3 images required."); return; }
    if (files.length > 15) { setError("Maximum 15 images."); return; }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));

    setLoading(true);
    try {
      if (editId) {
        await API.put(`/properties/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setSuccess("Property updated successfully!");
      } else {
        await API.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setSuccess("Property added successfully!");
      }
      resetForm();
      fetchProperties();
    } catch (err) {
      setError(err?.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/properties/${deleteTarget.id}`);
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
      setDeleteTarget(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/");
  };

  return (
    <div style={s.page}>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={s.confirmOverlay}>
          <div style={s.confirmBox}>
            <h3 style={s.confirmTitle}>Delete property?</h3>
            <p style={s.confirmSub}>
              "<strong style={{ color: "#f0ece4" }}>{deleteTarget.title}</strong>" will be permanently removed along with all its images.
            </p>
            <button style={s.confirmDelete} onClick={confirmDelete}>Yes, delete</button>
            <button style={s.confirmCancel} onClick={() => setDeleteTarget(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Topbar */}
      <div style={s.topbar}>
        <div style={s.brand}>
          <div style={s.brandDot} />
          <span style={s.brandName}>EstateHub</span>
          <span style={s.adminBadge}>Admin</span>
        </div>
        <div style={s.topRight}>
          <span style={s.adminName}>{user.name || user.email}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>

      <div style={s.body}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          <p style={s.sideLabel}>Menu</p>
          {[
            { id: "add",  icon: "＋", label: editId ? "Edit Property" : "Add Property" },
            { id: "list", icon: "◉", label: "All Properties" },
          ].map(({ id, icon, label }) => (
            <div key={id} style={s.navItem(tab === id)} onClick={() => { setTab(id); if (id === "add" && tab === "add") resetForm(); }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={s.main}>

          {/* Add / Edit form */}
          {tab === "add" && (
            <>
              <h1 style={s.pageTitle}>{editId ? "Edit Property" : "Add Property"}</h1>
              <p style={s.pageSub}>{editId ? "Update the property details below." : "Fill in the details to list a new property."}</p>

              <div style={s.formWrap}>
                {success && <div style={s.successBox}>✓ &nbsp;{success}</div>}
                {error   && <div style={s.errorBox}>{error}</div>}

                <div style={s.row2}>
                  <div style={s.field}>
                    <label style={s.label}>Title *</label>
                    <input style={s.input} placeholder="Sea View Villa" value={form.title} onChange={set("title")} onFocus={focus} onBlur={blur} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Price (₹) *</label>
                    <input style={s.input} type="number" placeholder="25000000" value={form.price} onChange={set("price")} onFocus={focus} onBlur={blur} />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>Location *</label>
                  <input style={s.input} placeholder="Mumbai, Bandra West" value={form.location} onChange={set("location")} onFocus={focus} onBlur={blur} />
                </div>

                <div style={s.field}>
                  <label style={s.label}>Description *</label>
                  <textarea style={s.textarea} rows={4} placeholder="Describe the property…" value={form.description} onChange={set("description")} onFocus={focus} onBlur={blur} />
                </div>

                <div style={s.field}>
                  <label style={s.label}>
                    Images {editId ? "(upload new to replace existing)" : "* (min 3 – max 15)"}
                  </label>
                  {previews.length > 0 && (
                    <div style={s.previewGrid}>
                      {previews.map((src, i) => (
                        <div key={i} style={s.previewItem}>
                          <img src={src} alt="" style={s.previewImg} />
                          <button style={s.removeImg} onClick={() => removeImg(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {files.length < 15 && (
                    <div style={s.uploadZone} onClick={() => fileRef.current.click()}
                      onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                      onDragOver={(e) => e.preventDefault()}>
                      <div style={{ fontSize: "24px", marginBottom: "6px" }}>📷</div>
                      <p style={{ fontSize: "13px", color: "#f0ece4", margin: "0 0 4px" }}>Click or drag images</p>
                      <p style={{ fontSize: "11px", color: "rgba(240,236,228,0.3)", margin: 0 }}>JPG, PNG, WEBP — max 5MB each</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp"
                    style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
                </div>

                <button style={{ ...s.submitBtn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
                  onClick={handleSubmit} disabled={loading}>
                  {loading ? (editId ? "Updating…" : "Adding…") : (editId ? "Update property" : "Add property")}
                </button>
                {editId && (
                  <button style={s.cancelBtn} onClick={resetForm}>Cancel edit</button>
                )}
              </div>
            </>
          )}

          {/* Property list */}
          {tab === "list" && (
            <>
              <h1 style={s.pageTitle}>All Properties</h1>
              <p style={s.pageSub}>{properties.length} {properties.length === 1 ? "property" : "properties"} listed</p>

              {error && <div style={s.errorBox}>{error}</div>}

              {listLoading ? (
                <p style={{ color: "rgba(240,236,228,0.3)", fontSize: "13px" }}>Loading…</p>
              ) : properties.length === 0 ? (
                <p style={{ color: "rgba(240,236,228,0.3)", fontSize: "13px" }}>No properties yet.</p>
              ) : (
                properties.map((p) => (
                  <div key={p.id} style={s.propRow}>
                    {p.images?.[0] ? (
                      <img src={`${BASE}${p.images[0]}`} alt={p.title} style={s.propThumb} />
                    ) : (
                      <div style={s.propThumbEmpty}>🏠</div>
                    )}
                    <div>
                      <p style={s.propTitle}>{p.title}</p>
                      <p style={s.propMeta}>{p.location} · {p.images?.length || 0} images</p>
                      <p style={s.propPrice}>₹{Number(p.price).toLocaleString("en-IN")}</p>
                    </div>
                    <div style={s.actionBtns}>
                      <button style={s.editBtn} onClick={() => { startEdit(p); }}>✎ Edit</button>
                      <button style={s.deleteBtn} onClick={() => setDeleteTarget(p)}>✕ Delete</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
