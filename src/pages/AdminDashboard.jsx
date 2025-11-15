// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiSearch,
//   FiRefreshCw,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
//   FiMail,
//   FiTrash2,
//   FiAlertTriangle,
// } from "react-icons/fi";
// import { IoBanSharp } from "react-icons/io5";
// import { AiOutlineUnorderedList } from "react-icons/ai";

// const API_BASE = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
// const ADMIN_PW = import.meta.env.VITE_ADMIN_PANEL_PW;

// export default function AdminDashboard() {
//   const [authed, setAuthed] = useState(false);
//   const [pw, setPw] = useState("");
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterSpam, setFilterSpam] = useState("any");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [showConfig, setShowConfig] = useState(false);
//   const [tempApiBase, setTempApiBase] = useState(API_BASE);
//   const [tempAdminPw, setTempAdminPw] = useState(ADMIN_PW);
//   const [isTableView, setIsTableView] = useState(true);
//   const [autoRefresh, setAutoRefresh] = useState(true);

//   useEffect(() => {
//     if (!authed || !autoRefresh) return;

//     const t = setInterval(() => {
//       fetchContacts();
//     }, 10000); // refresh every 10 seconds

//     return () => clearInterval(t);
//   }, [authed, autoRefresh]);

//   /* ------------------------------
//       NAVBAR HIDING FIX
//   ------------------------------ */
//   useEffect(() => {
//     const nav = document.querySelector("nav");
//     if (nav) nav.style.display = authed ? "flex" : "none";
//     return () => {
//       if (nav) nav.style.display = "flex";
//     };
//   }, [authed]);

//   function exportCSV() {
//     if (!contacts || contacts.length === 0) {
//       alert("No contacts to export");
//       return;
//     }

//     const headers = [
//       "Name",
//       "Email",
//       "Message",
//       "AI Label",
//       "Score",
//       "Spam",
//       "Created At",
//     ];
//     const rows = contacts.map((c) => [
//       c.name,
//       c.email,
//       c.message.replace(/\n/g, " "),
//       c.ai_label,
//       c.ai_score,
//       c.is_spam,
//       c.created_at,
//     ]);

//     const csv = [
//       headers.join(","),
//       ...rows.map((r) =>
//         r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `contacts_${new Date().toLocaleDateString()}.csv`;
//     a.click();

//     URL.revokeObjectURL(url);
//   }

//   function apiBaseConfigured() {
//     return (
//       (typeof API_BASE === "string" && API_BASE.length > 0) ||
//       window.sessionStorage.getItem("VITE_SUPABASE_FUNCTION_URL")
//     );
//   }

//   function getEffectiveApiBase() {
//     const s = window.sessionStorage.getItem("VITE_SUPABASE_FUNCTION_URL");
//     return s || API_BASE;
//   }

//   function getHeaders() {
//     return {
//       "Content-Type": "application/json",
//       "x-admin-secret": pw,
//     };
//   }

//   async function fetchContacts() {
//     if (!authed) return;
//     setLoading(true);

//     try {
//       const base = getEffectiveApiBase();
//       const body = {
//         filterSpam: filterSpam === "any" ? null : filterSpam === "true",
//         limit,
//         offset: (page - 1) * limit,
//         q: search || null,
//       };

//       const res = await fetch(`${base}/admin_get_contacts`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error(`(${res.status})`);

//       const json = await res.json();
//       setContacts(json.contacts || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       alert(
//         "🎯 Failed to load contacts. Wrong admin password or wrong function URL."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (authed) fetchContacts();
//   }, [authed, filterSpam, page]);

//   /* ------------------------------
//       LOGIN FIX
//   ------------------------------ */
//   function handleLogin() {
//     const stored = window.sessionStorage.getItem("VITE_ADMIN_PANEL_PW");

//     if (pw === ADMIN_PW || pw === stored) {
//       setAuthed(true);
//       window.sessionStorage.setItem("admin_pw", pw);
//       return;
//     }

//     alert("❌ Wrong password");
//   }

//   /* ------------------------------
//       LOGOUT + REDIRECT FIX
//   ------------------------------ */
//   function logout() {
//     window.sessionStorage.removeItem("VITE_ADMIN_PANEL_PW");
//     window.sessionStorage.removeItem("admin_pw");
//     window.sessionStorage.removeItem("VITE_SUPABASE_FUNCTION_URL");

//     setAuthed(false);
//     setPw("");
//     setContacts([]);

//     window.location.href = "/"; // redirect to home page
//   }

//   async function doAction(action, id, ip_hash = null) {
//     try {
//       const base = getEffectiveApiBase();
//       const res = await fetch(`${base}/admin_update_contact`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: JSON.stringify({ action, id, ip: ip_hash }),
//       });

//       if (!res.ok) throw new Error(`(${res.status})`);

//       await fetchContacts();
//     } catch (err) {
//       console.error("Action error:", err);
//       alert("Action failed. Check console.");
//     }
//   }

//   async function blockIp(ipHash, days = 30) {
//     try {
//       const base = getEffectiveApiBase();
//       const res = await fetch(`${base}/admin_deny_ip`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: JSON.stringify({ ip_hash: ipHash, block_days: days }),
//       });

//       if (!res.ok) throw new Error();

//       alert("IP blocked");
//       await fetchContacts();
//     } catch (err) {
//       console.error("Block error:", err);
//       alert("Failed to block IP");
//     }
//   }

//   /* ------------------------------
//       UI STARTS BELOW
//   ------------------------------ */

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white p-6 pt-24">
//       {/* LOGIN PAGE */}
//       {!authed ? (
//         <div className="max-w-xl mx-auto mt-20 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
//           <h2 className="text-3xl font-bold mb-6">Admin Login</h2>

//           <input
//             type="password"
//             className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl mb-4"
//             placeholder="Enter admin password"
//             value={pw}
//             onChange={(e) => setPw(e.target.value)}
//           />

//           <button
//             onClick={handleLogin}
//             className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold"
//           >
//             Unlock Admin
//           </button>

//           <button
//             className="mt-4 w-full border border-gray-600 rounded-xl py-2"
//             onClick={() => setShowConfig(!showConfig)}
//           >
//             Open Config
//           </button>

//           {showConfig && (
//             <div className="mt-4 bg-gray-900 p-4 rounded-xl space-y-3 border border-gray-700">
//               <input
//                 value={tempApiBase}
//                 onChange={(e) => setTempApiBase(e.target.value)}
//                 placeholder="Function URL"
//                 className="w-full bg-gray-800 p-2 rounded border border-gray-700"
//               />
//               <input
//                 value={tempAdminPw}
//                 onChange={(e) => setTempAdminPw(e.target.value)}
//                 placeholder="Admin Password"
//                 className="w-full bg-gray-800 p-2 rounded border border-gray-700"
//               />
//               <button
//                 onClick={() => {
//                   window.sessionStorage.setItem(
//                     "VITE_SUPABASE_FUNCTION_URL",
//                     tempApiBase
//                   );
//                   window.sessionStorage.setItem(
//                     "VITE_ADMIN_PANEL_PW",
//                     tempAdminPw
//                   );
//                   alert("Saved!");
//                 }}
//                 className="w-full bg-green-600 py-2 rounded-xl"
//               >
//                 Save to Session
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* ------------------------------
//            ADMIN PANEL
//         ------------------------------ */
//         <div className="max-w-7xl mx-auto">
//           <header className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold">Contacts — Admin</h1>

//             <div className="flex items-center gap-3">
//               <input
//                 className="bg-gray-800 border border-gray-700 p-2 rounded-xl hidden md:block"
//                 placeholder="Search…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />

//               <select
//                 className="bg-gray-800 border border-gray-700 p-2 rounded-xl"
//                 value={filterSpam}
//                 onChange={(e) => setFilterSpam(e.target.value)}
//               >
//                 <option value="any">All</option>
//                 <option value="false">Not Spam</option>
//                 <option value="true">Spam Only</option>
//               </select>

//               <button
//                 className="p-2 bg-gray-800 border border-gray-700 rounded-xl"
//                 onClick={() => fetchContacts()}
//               >
//                 <FiRefreshCw />
//               </button>

//               <button
//                 className="p-2 bg-gray-800 border border-gray-700 rounded-xl"
//                 onClick={() => setIsTableView((v) => !v)}
//               >
//                 <AiOutlineUnorderedList />
//               </button>

//               <button
//                 onClick={exportCSV}
//                 className="p-2 bg-gray-800 border border-gray-700 rounded-xl"
//                 title="Download CSV"
//               >
//                 📥 CSV
//               </button>

//               <button
//                 onClick={() => setAutoRefresh((a) => !a)}
//                 className={`p-2 rounded-xl border ${
//                   autoRefresh ? "bg-green-700" : "bg-gray-700"
//                 }`}
//               >
//                 {autoRefresh ? "Live ON" : "Live OFF"}
//               </button>

//               <button
//                 onClick={logout}
//                 className="p-2 px-4 bg-gray-800 border border-gray-700 rounded-xl flex items-center gap-2"
//               >
//                 <FiLogOut /> Logout
//               </button>
//             </div>
//           </header>

//           {/* CONTACT TABLE */}
//           {!loading ? (
//             <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
//               {contacts.length === 0 ? (
//                 <div className="text-center py-10 text-gray-400">
//                   No results
//                 </div>
//               ) : (
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
//                       <th className="py-3">Name</th>
//                       <th>Email</th>
//                       <th>Message</th>
//                       <th>AI</th>
//                       <th className="text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {contacts.map((c) => (
//                       <tr key={c.id} className="border-b border-gray-700">
//                         <td className="py-3">{c.name}</td>
//                         <td>{c.email}</td>
//                         <td className="max-w-lg truncate">{c.message}</td>
//                         <td>
//                           <span
//                             className={`px-2 py-1 rounded text-xs ${
//                               c.is_spam
//                                 ? "bg-red-600"
//                                 : c.ai_score > 0.7
//                                 ? "bg-yellow-400 text-black"
//                                 : "bg-green-600"
//                             }`}
//                           >
//                             {c.ai_label?.toUpperCase()}
//                           </span>
//                         </td>
//                         <td className="text-right space-x-2">
//                           <button
//                             title="Retry"
//                             onClick={() => doAction("retry_email", c.id)}
//                             className="p-2 bg-blue-600 rounded-xl"
//                           >
//                             <FiMail />
//                           </button>
//                           <button
//                             title="Spam"
//                             onClick={() => doAction("mark_spam", c.id)}
//                             className="p-2 bg-red-600 rounded-xl"
//                           >
//                             <FiAlertTriangle />
//                           </button>
//                           <button
//                             title="Block IP"
//                             onClick={() => blockIp(c.ip_address)}
//                             className="p-2 bg-gray-700 rounded-xl"
//                           >
//                             <IoBanSharp />
//                           </button>
//                           <button
//                             title="Delete"
//                             onClick={() => doAction("delete", c.id)}
//                             className="p-2 bg-black rounded-xl"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-400">Loading…</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }








import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { IoBanSharp } from "react-icons/io5";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

/**
 * AdminDashboard.jsx
 * Full-featured admin dashboard for managing contact messages.
 * Features included:
 *  - Login/session handling (env or sessionStorage)
 *  - Fetch contacts (POST -> /admin_get_contacts)
 *  - Filtering, search, pagination
 *  - Table (desktop) & Cards (mobile)
 *  - Bulk selection + bulk delete
 *  - Mark read / unread (single + bulk)
 *  - Export CSV
 *  - Auto-refresh live mode
 *  - Analytics charts (simple counts)
 *  - Retry email, block IP, delete, mark spam/unspam
 *  - Detail modal
 *  - Config panel for session-only overrides
 *
 * NOTE: This file expects the following env variables (or set in sessionStorage via Config):
 *  - VITE_SUPABASE_FUNCTION_URL
 *  - VITE_ADMIN_PANEL_PW
 *
 * The endpoints used are:
 *  POST ${API_BASE}/admin_get_contacts        -> { filterSpam, q, limit, offset }
 *  POST ${API_BASE}/admin_update_contact      -> { action, id, ip }
 *  POST ${API_BASE}/admin_deny_ip             -> { ip_hash, block_days }
 *
 * Keep admin secret secure. For production use server-side auth instead of client-supplied passwords.
 */

const API_BASE = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
const ADMIN_PW = import.meta.env.VITE_ADMIN_PANEL_PW;

const DEFAULT_LIMIT = 20;
const AUTO_REFRESH_INTERVAL_MS = 10000; // default 5s when auto-refresh ON

function csvEscape(val) {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function downloadCSV(filename, rows) {
  const header = ["id", "name", "email", "message", "is_spam", "ai_label", "ai_score", "created_at", "ip_address"];
  const csv = [header.join(",")].concat(
    rows.map((r) =>
      header.map((h) => csvEscape(r[h])).join(",")
    )
  ).join("");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSpam, setFilterSpam] = useState("any");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [tempApiBase, setTempApiBase] = useState(API_BASE || "");
  const [tempAdminPw, setTempAdminPw] = useState(ADMIN_PW || "");
  const [isTableView, setIsTableView] = useState(true);

  // Selection & bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAllPage, setSelectAllPage] = useState(false);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(false);
  const autoRefTimer = useRef(null);

  // CSV export / analytics
  const contactsRef = useRef([]);

  // UI helpers
  const [liveModeNote, setLiveModeNote] = useState(false);

  function apiBaseConfigured() {
    return (
      (typeof API_BASE === "string" && API_BASE.length > 0) ||
      (typeof window !== "undefined" && window.sessionStorage.getItem("VITE_SUPABASE_FUNCTION_URL")) ||
      (tempApiBase && tempApiBase.length > 0)
    );
  }

  function getEffectiveApiBase() {
    try {
      if (typeof window !== "undefined") {
        const s = window.sessionStorage.getItem("VITE_SUPABASE_FUNCTION_URL");
        if (s) return s;
      }
    } catch (e) {}
    return API_BASE || tempApiBase;
  }

  function getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-admin-secret": pw,
    };
  }

  async function fetchContacts() {
    if (!authed) return;
    const base = getEffectiveApiBase();
    if (!base) {
      alert("API base URL not configured. Open Config and provide VITE_SUPABASE_FUNCTION_URL.");
      return;
    }
    setLoading(true);
    try {
      const body = {
        filterSpam: filterSpam === "any" ? null : filterSpam === "true",
        limit,
        offset: (page - 1) * limit,
        q: search || null,
      };

      const res = await fetch(`${base}/admin_get_contacts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed (${res.status}): ${txt}`);
      }

      const json = await res.json();
      setContacts(json.contacts || []);
      contactsRef.current = json.contacts || [];
      // reset selection on page change
      setSelectedIds(new Set());
      setSelectAllPage(false);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      alert("Failed to fetch contacts. Check your admin password and function URL. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, filterSpam, page]);

  useEffect(() => {
    if (autoRefresh && authed) {
      setLiveModeNote(true);
      autoRefTimer.current = setInterval(() => {
        fetchContacts();
      }, AUTO_REFRESH_INTERVAL_MS);
    } else {
      setLiveModeNote(false);
      if (autoRefTimer.current) {
        clearInterval(autoRefTimer.current);
        autoRefTimer.current = null;
      }
    }
    return () => {
      if (autoRefTimer.current) clearInterval(autoRefTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, authed]);

  function handleLogin() {
    // prefer build-time secret
    if (ADMIN_PW && ADMIN_PW.length > 0) {
      if (pw === ADMIN_PW) {
        setAuthed(true);
        return;
      } else {
        alert("Wrong password");
        return;
      }
    }

    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("VITE_ADMIN_PANEL_PW") : null;
    if (stored && pw === stored) {
      setAuthed(true);
      return;
    }

    if (tempAdminPw && pw === tempAdminPw) {
      try {
        window.sessionStorage.setItem("VITE_ADMIN_PANEL_PW", tempAdminPw);
      } catch (e) {}
      setAuthed(true);
      return;
    }

    alert("Wrong password or admin password not configured");
  }

  async function doAction(action, id, ip_hash = null) {
    const base = getEffectiveApiBase();
    try {
      const res = await fetch(`${base}/admin_update_contact`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ action, id, ip: ip_hash }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Action failed (${res.status}): ${txt}`);
      }
      await fetchContacts();
    } catch (err) {
      console.error("Action failed:", err);
      alert("Action failed. Check console for details.");
    }
  }

  async function blockIp(ipHash, days = 30) {
    const base = getEffectiveApiBase();
    try {
      const res = await fetch(`${base}/admin_deny_ip`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ ip_hash: ipHash, block_days: days }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Block failed (${res.status}): ${txt}`);
      }
      alert("IP blocked");
      await fetchContacts();
    } catch (err) {
      console.error("Block failed:", err);
      alert("Block IP failed");
    }
  }

  function saveConfigToSession() {
    try {
      if (tempApiBase) window.sessionStorage.setItem("VITE_SUPABASE_FUNCTION_URL", tempApiBase);
      if (tempAdminPw) window.sessionStorage.setItem("VITE_ADMIN_PANEL_PW", tempAdminPw);
      setShowConfig(false);
      alert("Saved config for this session. Reload if needed.");
    } catch (e) {
      alert("Failed to save config to sessionStorage");
    }
  }

  function logout() {
    try {
      window.sessionStorage.removeItem("VITE_ADMIN_PANEL_PW");
      window.sessionStorage.removeItem("VITE_SUPABASE_FUNCTION_URL");
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_pw");
    } catch (e) {}
    setAuthed(false);
    setPw("");
    setContacts([]);
    // go to home page on logout
    navigate("/");
  }

  // Selection helpers
  function toggleSelectOne(id) {
    setSelectedIds((prev) => {
      const clone = new Set(prev);
      if (clone.has(id)) clone.delete(id);
      else clone.add(id);
      setSelectAllPage(false);
      return clone;
    });
  }

  function toggleSelectAllOnPage() {
    if (selectAllPage) {
      setSelectedIds(new Set());
      setSelectAllPage(false);
      return;
    }
    // select all currently loaded contacts
    const s = new Set(contacts.map((c) => c.id));
    setSelectedIds(s);
    setSelectAllPage(true);
  }

  async function bulkDelete() {
    if (selectedIds.size === 0) return alert("No items selected");
    if (!confirm(`Delete ${selectedIds.size} selected messages? This cannot be undone.`)) return;
    for (const id of Array.from(selectedIds)) {
      await doAction("delete", id);
    }
    setSelectedIds(new Set());
  }

  async function bulkMarkRead(flag = true) {
    if (selectedIds.size === 0) return alert("No items selected");
    for (const id of Array.from(selectedIds)) {
      await doAction(flag ? "mark_read" : "mark_unread", id);
    }
    setSelectedIds(new Set());
  }

  function exportSelectedCSV() {
    const rows = contactsRef.current.filter((c) => selectedIds.has(c.id));
    if (rows.length === 0) return alert("No items selected for export");
    downloadCSV(`contacts_export_${new Date().toISOString()}.csv`, rows);
  }

  function exportAllCSV() {
    const rows = contactsRef.current.slice();
    if (rows.length === 0) return alert("No contacts to export");
    downloadCSV(`contacts_all_${new Date().toISOString()}.csv`, rows);
  }

  // analytics derived data
  const analytics = useMemo(() => {
    const total = contactsRef.current.length;
    const spam = contactsRef.current.filter((c) => c.is_spam).length;
    const byLabel = {};
    for (const c of contactsRef.current) {
      const label = c.ai_label || "unknown";
      byLabel[label] = (byLabel[label] || 0) + 1;
    }
    const pie = Object.entries(byLabel).map(([name, value]) => ({ name, value }));
    const bar = pie.map((p) => ({ label: p.name, value: p.value }));
    return { total, spam, pie, bar };
  }, [contactsRef.current]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a4de6c", "#d0ed57"];

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white p-6 pt-20">
      {!authed ? (
        <div className="max-w-xl mx-auto mt-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-4">Admin — Login</h2>
          {!apiBaseConfigured() && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50/10 border border-yellow-200/10 text-yellow-300 text-sm">
              <strong>Note:</strong> No functions URL or admin password found. Open Config to set values for this browser session.
            </div>
          )}

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Admin password"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3">
            <button onClick={handleLogin} className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-xl py-3 font-semibold shadow">
              Unlock Admin
            </button>
            <button onClick={() => setShowConfig((s) => !s)} className="px-4 py-3 border border-gray-700 rounded-xl">
              Open Config
            </button>
          </div>

          {showConfig && (
            <div className="mt-4 space-y-3 bg-gray-800 rounded-lg p-4 border border-gray-700">
              <label className="text-sm text-gray-300">Functions Base URL</label>
              <input value={tempApiBase} onChange={(e) => setTempApiBase(e.target.value)} placeholder="https://<ref>.functions.supabase.co" className="w-full bg-gray-900 border border-gray-700 p-2 rounded" />
              <label className="text-sm text-gray-300">Admin UI Password (session)</label>
              <input value={tempAdminPw} onChange={(e) => setTempAdminPw(e.target.value)} placeholder="admin-password" className="w-full bg-gray-900 border border-gray-700 p-2 rounded" />
              <div className="flex gap-2 mt-2">
                <button onClick={saveConfigToSession} className="bg-green-600 px-3 py-2 rounded-xl">Save to Session</button>
                <button onClick={() => { setTempApiBase(""); setTempAdminPw(""); }} className="px-3 py-2 rounded-xl border">Reset</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Session-only storage. For production set VITE_ variables at build time.</p>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-400">Tip: use the in-browser Config to run locally if .env isn't available.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-6 sticky top-4 z-20">
            <div>
              <h1 className="text-3xl font-bold">Contacts — Admin</h1>
              <p className="text-sm text-gray-400">Manage messages, block IPs and retry notifications.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
                <FiSearch className="text-gray-400" />
                <input
                  className="bg-transparent outline-none text-sm text-white placeholder-gray-400 w-60"
                  placeholder="Search name, email, message"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => { setPage(1); fetchContacts(); }} className="ml-2 text-sm px-3 py-1 bg-gray-700 rounded">Search</button>
              </div>

              <select value={filterSpam} onChange={(e) => { setFilterSpam(e.target.value); setPage(1); }} className="bg-gray-800 border border-gray-700 rounded-xl p-2">
                <option value="any">All</option>
                <option value="false">Not Spam</option>
                <option value="true">Spam Only</option>
              </select>

              <button onClick={() => { setPage(1); fetchContacts(); }} title="Refresh" className="bg-gray-800 border border-gray-700 p-2 rounded-xl">
                <FiRefreshCw />
              </button>

              <button onClick={() => setIsTableView(v => !v)} title="Toggle view" className="bg-gray-800 border border-gray-700 p-2 rounded-xl">
                <AiOutlineUnorderedList />
              </button>

              <button onClick={logout} title="Logout" className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
                <FiLogOut /> Logout
              </button>
            </div>
          </header>

          {/* top controls */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selectAllPage} onChange={toggleSelectAllOnPage} />
                <span className="text-sm text-gray-300">Select all on page</span>
              </label>

              <button onClick={() => bulkDelete()} className="ml-2 bg-red-600 px-3 py-1 rounded">Bulk Delete</button>
              <button onClick={() => bulkMarkRead(true)} className="ml-2 bg-green-600 px-3 py-1 rounded">Mark Read</button>
              <button onClick={() => bulkMarkRead(false)} className="ml-2 bg-yellow-600 px-3 py-1 rounded">Mark Unread</button>

              <div className="ml-4">
                <button onClick={() => exportSelectedCSV()} className="px-3 py-1 border rounded mr-2">Export Selected CSV</button>
                <button onClick={() => exportAllCSV()} className="px-3 py-1 border rounded">Export Page CSV</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300">Auto-refresh</label>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            </div>
          </div>

          {/* analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
              <div className="text-sm text-gray-400">Total on page</div>
              <div className="text-2xl font-bold">{analytics.total}</div>
              <div className="text-xs text-gray-400">Spam: {analytics.spam}</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 col-span-2">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.bar}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* content */}
          <main>
            {loading ? (
              <div className="py-24 text-center text-gray-400">Loading…</div>
            ) : contacts.length === 0 ? (
              <div className="py-24 text-center">
                <div className="inline-block bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow">
                  <h3 className="text-lg font-semibold">No contacts found</h3>
                  <p className="text-sm text-gray-400 mt-2">No messages match the current filters.</p>
                </div>
              </div>
            ) : (
              <>
                {/* TABLE (desktop) */}
                <div className="hidden md:block">
                  <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">#</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">AI</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {contacts.map((c, idx) => (
                          <tr key={c.id} className={`${selectedIds.has(c.id) ? "bg-gray-700" : ""}`}>
                            <td className="px-4 py-4 whitespace-nowrap font-medium">
                              <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelectOne(c.id)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{c.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{c.email}</td>
                            <td className="px-6 py-4 max-w-xl text-sm text-gray-300 overflow-hidden truncate">{c.message}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.is_spam ? "bg-red-600 text-white" : c.ai_score>0.7 ? "bg-yellow-400 text-black" : "bg-green-600 text-white"}`}>
                                {(c.ai_label || "unknown").toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button title="View" onClick={() => setSelectedContact(c)} className="p-2 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800">
                                  <FiMail />
                                </button>
                                {!c.is_spam ? (
                                  <button title="Mark Spam" onClick={() => doAction("mark_spam", c.id)} className="p-2 rounded-lg bg-red-700 hover:bg-red-600">
                                    <FiAlertTriangle />
                                  </button>
                                ) : (
                                  <button title="Unmark Spam" onClick={() => doAction("unmark_spam", c.id)} className="p-2 rounded-lg bg-green-600 hover:bg-green-500">
                                    <IoBanSharp />
                                  </button>
                                )}
                                <button title="Retry Email" onClick={() => doAction("retry_email", c.id)} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500">
                                  <FiMail />
                                </button>
                                <button title="Block IP" onClick={() => blockIp(c.ip_address)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                                  <IoBanSharp />
                                </button>
                                <button title="Delete" onClick={() => doAction("delete", c.id)} className="p-2 rounded-lg bg-black hover:bg-gray-800">
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CARDS (mobile) */}
                <div className="md:hidden space-y-4">
                  {contacts.map((c) => (
                    <motion.div key={c.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelectOne(c.id)} />
                            <h3 className="font-semibold text-lg">{c.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.is_spam ? "bg-red-600 text-white" : c.ai_score>0.7 ? "bg-yellow-400 text-black" : "bg-green-600 text-white"}`}>
                              {(c.ai_label || "unknown").toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">{c.email}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button onClick={() => setSelectedContact(c)} className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-700">View</button>
                          <div className="flex gap-2">
                            <button onClick={() => doAction("retry_email", c.id)} className="px-3 py-2 rounded-xl bg-blue-600">Retry</button>
                            <button onClick={() => blockIp(c.ip_address)} className="px-3 py-2 rounded-xl bg-gray-700">Block</button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-300 whitespace-pre-line">{c.message}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </main>

          {/* pagination */}
          <footer className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-2 rounded-xl bg-gray-800 border border-gray-700">
                <FiChevronLeft />
              </button>
              <div className="text-sm text-gray-300">Page {page}</div>
              <button onClick={() => setPage((p) => p + 1)} className="p-2 rounded-xl bg-gray-800 border border-gray-700">
                <FiChevronRight />
              </button>
            </div>

            <div className="text-sm text-gray-400">Showing {contacts.length} results</div>
          </footer>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedContact(null)} />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative max-w-2xl w-full bg-gray-900 p-6 rounded-2xl border border-gray-700 z-60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                  <div className="text-sm text-gray-400">{selectedContact.email} • <span className="text-xs">{new Date(selectedContact.created_at).toLocaleString()}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => doAction(selectedContact.is_spam ? "unmark_spam" : "mark_spam", selectedContact.id)} className="px-3 py-2 rounded-xl bg-red-700">Toggle Spam</button>
                  <button onClick={() => { doAction("retry_email", selectedContact.id); }} className="px-3 py-2 rounded-xl bg-blue-600">Retry Email</button>
                  <button onClick={() => { doAction("delete", selectedContact.id); setSelectedContact(null); }} className="px-3 py-2 rounded-xl bg-black">Delete</button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-300 whitespace-pre-line">{selectedContact.message}</div>

              <div className="mt-4 flex gap-2 text-xs text-gray-400">
                <div>AI label: <span className="font-medium text-white ml-1">{selectedContact.ai_label}</span></div>
                <div>Score: <span className="font-medium text-white ml-1">{(selectedContact.ai_score || 0).toFixed(2)}</span></div>
                <div>IP-hash: <span className="font-mono text-xs text-gray-400 ml-1">{selectedContact.ip_address}</span></div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setSelectedContact(null)} className="px-4 py-2 rounded-xl border border-gray-700">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

