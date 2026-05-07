import { useState, useRef } from "react";
import API from "../services/api";

const s = {
  wrap: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "12px",
    padding: "36px 40px",
  },
  sectionLabel: {
    fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#c9a96e", fontWeight: 500, marginBottom: "24px",
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "18px" },
  label: {
    display: "block", fontSize: "11px", letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "8px",
  },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px",
    padding: "12px 16px", fontSize: "13px", color: "#f0ece4",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px",
    padding: "12px 16px", fontSize: "13px", color: "#f0ece4",
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", resize: "vertical", minHeight: "100px",
    transition: "border-color 0.2s",
  },
  uploadZone: {
    border: "1px dashed rgba(201,169,110,0.3)", borderRadius: "10px",
    padding: "32px", textAlign: "center", cursor: "pointer",
    background: "rgba(201,169,110,0.03)", transition: "border-color 0.2s",
    marginBottom: "12px",
  },
  uploadIcon: { fontSize: "28px", marginBottom: "8px" },
  uploadTitle: { fontSize: "13px", color: "#f0ece4", margin: "0 0 4px" },
  uploadSub: { fontSize: "11px", color: "rgba(240,236,228,0.3)", margin: 0 },
  previewGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "8px", marginBottom: "16px",
  },
  previewItem: { position: "relative", borderRadius: "6px", overflow: "hidden" },
  previewImg: { width: "100%", height: "80px", objectFit: "cover", display: "block" },
  removeBtn: {
    position: "absolute", top: "4px", right: "4px",
    background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%",
    width: "20px", height: "20px", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: "10px",
  },
  countBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    fontSize: "12px", color: "rgba(240,236,228,0.35)", marginBottom: "16px",
  },
  countNum: { color: "#c9a96e", fontWeight: 500 },
  submitBtn: {
    width: "100%", background: "#c9a96e", border: "none", borderRadius: "8px",
    padding: "15px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", marginTop: "8px",
  },
  errorBox: {
    background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)",
    borderRadius: "8px", padding: "10px 14px", fontSize: "12px",
    color: "#f59595", marginBottom: "16px",
  },
  successBox: {
    background: "rgba(110,189,142,0.1)", border: "0.5px solid rgba(110,189,142,0.3)",
    borderRadius: "8px", padding: "10px 14px", fontSize: "12px",
    color: "#6ebd8e", marginBottom: "16px",
  },
};

export default function AddProperty() {
  const [form, setForm] = useState({ title: "", price: "", location: "", description: "" });
  const [files, setFiles]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  const handleFiles = (selected) => {
    const newFiles = Array.from(selected);
    const combined = [...files, ...newFiles].slice(0, 15);
    setFiles(combined);
    const newPreviews = combined.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const updatedFiles    = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.title || !form.price || !form.location || !form.description) {
      setError("All fields are required.");
      return;
    }
    if (files.length < 3) {
      setError("Please upload at least 3 images.");
      return;
    }
    if (files.length > 15) {
      setError("Maximum 15 images allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("title",       form.title);
    formData.append("price",       form.price);
    formData.append("location",    form.location);
    formData.append("description", form.description);
    files.forEach((file) => formData.append("images", file));

    setLoading(true);
    try {
      await API.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Property added successfully!");
      setForm({ title: "", price: "", location: "", description: "" });
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <p style={s.sectionLabel}>Add new property</p>

      {error   && <div style={s.errorBox}>{error}</div>}
      {success && <div style={s.successBox}>✓ &nbsp;{success}</div>}

      <div style={s.row2}>
        <div style={s.field}>
          <label style={s.label}>Property title *</label>
          <input style={s.input} placeholder="Sea View Villa"
            value={form.title} onChange={set("title")} onFocus={focus} onBlur={blur} />
        </div>
        <div style={s.field}>
          <label style={s.label}>Price (₹) *</label>
          <input style={s.input} type="number" placeholder="25000000"
            value={form.price} onChange={set("price")} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      <div style={s.field}>
        <label style={s.label}>Location *</label>
        <input style={s.input} placeholder="Mumbai, Bandra West"
          value={form.location} onChange={set("location")} onFocus={focus} onBlur={blur} />
      </div>

      <div style={s.field}>
        <label style={s.label}>Description *</label>
        <textarea style={s.textarea} rows={4}
          placeholder="Describe the property in detail…"
          value={form.description} onChange={set("description")}
          onFocus={focus} onBlur={blur} />
      </div>

      <div style={s.field}>
        <label style={s.label}>Images * (min 3 – max 15)</label>

        {previews.length > 0 && (
          <>
            <div style={s.countBar}>
              <span><span style={s.countNum}>{files.length}</span> / 15 images selected</span>
              {files.length < 3 && (
                <span style={{ color: "#e28b45" }}>Add {3 - files.length} more</span>
              )}
            </div>
            <div style={s.previewGrid}>
              {previews.map((src, i) => (
                <div key={i} style={s.previewItem}>
                  <img src={src} alt="" style={s.previewImg} />
                  <button style={s.removeBtn} onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        {files.length < 15 && (
          <div
            style={s.uploadZone}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)")}
          >
            <div style={s.uploadIcon}>📷</div>
            <p style={s.uploadTitle}>Click or drag images here</p>
            <p style={s.uploadSub}>JPG, JPEG, PNG, WEBP — max 5MB each</p>
          </div>
        )}

        <input
          ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <button
        style={{ ...s.submitBtn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
        onClick={handleSubmit} disabled={loading}
      >
        {loading ? "Adding property…" : "Add property"}
      </button>
    </div>
  );
}
