import { useState, useEffect } from "react";
import { TEAL, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import Input from "../Components/Input";
import PageHeader from "../Components/PageHeader";

export default function NotesPage({ currentTrip }) {
  const [notes, setNotes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", stop: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip?.id) { setLoading(false); return; }
    const fetchNotes = async () => {
      setLoading(true);
      try {
      const res = await fetch(`/api/trips/${currentTrip.id}/notes`, {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
setNotes(await res.json());
      } catch (err) {
        console.error("Failed to load notes", err);
      }
      setLoading(false);
    };
    fetchNotes();
  }, [currentTrip]);

  const addNote = async () => {
    if (!newNote.title.trim()) return;
    const note = { ...newNote, id: Date.now(), date: new Date().toLocaleDateString() };
    setNotes([note, ...notes]);
    setAdding(false);
    setNewNote({ title: "", content: "", stop: "" });
const res = await fetch(`/api/trips/${currentTrip.id}/notes`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify(newNote),
});
const saved = await res.json();
setNotes([saved, ...notes]);
setAdding(false);
setNewNote({ title: "", content: "", stop: "" });  };

  const deleteNote = async (id) => {
    setNotes(notes.filter(n => n.id !== id));
await fetch(`/api/trips/${currentTrip.id}/notes/${id}`, {
  method: "DELETE",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
setNotes(notes.filter(n => n.id !== id));  };

  return (
    <div>
      <PageHeader title="Trip Notes & Journal"
        subtitle={currentTrip?.name ? `${currentTrip.name} · Your travel diary` : "Select a trip"}
        actions={<Btn onClick={() => setAdding(true)}>+ Add Note</Btn>} />

      {adding && (
        <Card style={{ marginBottom: 20, border: `2px solid ${TEAL}` }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14, color: TEAL_DARK }}>New Note</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label="Title" placeholder="Note title..."
              value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
            <Input label="City / Stop" placeholder="e.g. Paris"
              value={newNote.stop} onChange={e => setNewNote({ ...newNote, stop: e.target.value })} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Content</label>
              <textarea placeholder="Write your note..."
                value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 80, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn small onClick={addNote}>Save Note</Btn>
              <Btn small variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p style={{ color: GRAY_MED, fontSize: 14, marginBottom: 20 }}>No notes yet. Start your travel journal!</p>
          <Btn onClick={() => setAdding(true)}>+ Write First Note</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {notes.map(n => (
            <Card key={n.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>📝 {n.title}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small variant="ghost">✎</Btn>
                  <Btn small variant="danger" onClick={() => deleteNote(n.id)}>✕</Btn>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.6, margin: "0 0 12px" }}>{n.content}</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {n.stop && <Badge color="teal">📍 {n.stop}</Badge>}
                <span style={{ fontSize: 12, color: GRAY_MED }}>{n.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}