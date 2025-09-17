import { useState, useEffect } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { Plus, Shield, User, X, Search, Filter, Pencil, Trash2 } from "lucide-react";

function Dropdown({ id, icon: Icon, options, selected, onChange, openDropdown, setOpenDropdown }) {
  const open = openDropdown === id;

  return (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(open ? null : id)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 shadow-md bg-white 
                   hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 
                   transition min-w-[150px]"
      >
        {Icon && <Icon className="text-green-600" size={16} />}
        <span className="truncate">{selected}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setOpenDropdown(null);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${
                opt === selected ? "bg-green-100 font-semibold" : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const API = "http://localhost:5000/api";

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);


  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [selectedGroupForPrivileges, setSelectedGroupForPrivileges] = useState(null);

  const [newGroup, setNewGroup] = useState("");
  const [newUser, setNewUser] = useState({ username: "", email: "", groupId: "" });
  const [searchGroups, setSearchGroups] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedPrivilege, setSelectedPrivilege] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // static privilege list
  const allPrivilegesList = [
    { privilege_id: 1, privilege_name: "create_user" },
    { privilege_id: 2, privilege_name: "delete_user" },
    { privilege_id: 3, privilege_name: "add_privilege_user" },
    { privilege_id: 4, privilege_name: "remove_privilege_user" },
    { privilege_id: 5, privilege_name: "create_group" },
    { privilege_id: 6, privilege_name: "add_privilege_group" },
  ];

  // fetch groups & users
  const fetchGroups = async () => {
    const res = await axios.get(`${API}/groups`);
    setGroups(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroup) return;
    await axios.post(`${API}/groups`, { groupName: newGroup });
    await fetchGroups();
    setNewGroup("");
    setShowGroupModal(false);
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.groupId) return;
    await axios.post(`${API}/users`, {
      username: newUser.username,
      email: newUser.email,
      passwordHash: "defaultpass",
      groupId: Number(newUser.groupId),
    });
    await fetchUsers();
    setNewUser({ username: "", email: "", groupId: "" });
    setShowUserModal(false);
  };

  const togglePrivilege = async (group, priv) => {
    const hasPriv = group.privileges.includes(priv.privilege_name);
    if (hasPriv) {
      await axios.delete(`${API}/groups/${group.group_id}/privileges/${priv.privilege_id}`);
    } else {
      await axios.post(`${API}/groups/${group.group_id}/privileges/${priv.privilege_id}`);
    }
    await fetchGroups();
    setSelectedGroupForPrivileges((await axios.get(`${API}/groups`)).data.find(g => g.group_id === group.group_id));
  };

  const getAllPrivileges = (user) => {
    const group = groups.find((g) => g.group_name === user.group);
    const groupPrivileges = group ? group.privileges : [];
    return [...new Set([...groupPrivileges, ...(user.privileges || [])])];
  };

  const fuseUsers = new Fuse(users, { keys: ["username", "group", "privileges"], threshold: 0.4 });
  const fuseGroups = new Fuse(groups, { keys: ["group_name", "privileges"], threshold: 0.4 });

  const filteredUsersRaw = searchUsers ? fuseUsers.search(searchUsers).map(r => r.item) : users;
  const filteredGroups = searchGroups ? fuseGroups.search(searchGroups).map(r => r.item) : groups;

  const allPrivileges = Array.from(new Set(groups.flatMap((g) => g.privileges)));

  const filteredUsers = filteredUsersRaw.filter((user) => {
    const allPrivs = getAllPrivileges(user);
    const groupMatch = selectedGroup === "All" || user.group === selectedGroup;
    const privilegeMatch = selectedPrivilege === "All" || allPrivs.includes(selectedPrivilege);
    return groupMatch && privilegeMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Admin Dashboard</h1>

      {/* Groups Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Shield className="text-green-600" /> Groups
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchGroups}
                onChange={(e) => setSearchGroups(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 pl-10 shadow-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              onClick={() => setShowGroupModal(true)}
              className="bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.group_id} className="rounded-2xl border border-gray-200 shadow-md p-5 hover:shadow-lg transition bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{group.group_name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.privileges.length > 0 ? (
                    group.privileges.map((p, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full">{p}</span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">No privileges yet</span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => { setSelectedGroupForPrivileges(group); setShowPrivilegeModal(true); }}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-lg text-sm shadow hover:from-green-700 hover:to-green-600 transition"
                  >
                    Edit Privileges
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No groups found</p>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><User className="text-green-600" /> Users</h2>
          <div className="flex items-center gap-4">
            <Dropdown id="group" icon={Shield} options={["All", ...groups.map((g) => g.group_name)]} selected={selectedGroup} onChange={setSelectedGroup} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <Dropdown id="privilege" icon={Filter} options={["All", ...allPrivileges]} selected={selectedPrivilege} onChange={setSelectedPrivilege} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search users..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 pl-10 shadow-md focus:ring-2 focus:ring-green-300 focus:border-green-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-700 to-green-500 text-white">
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Group</th>
                <th className="px-6 py-3 text-left">All Privileges</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, idx) => {
                  const allPrivs = getAllPrivileges(user);
                  return (
                    <tr key={user.user_id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50 transition`}>
                      <td className="px-6 py-4 font-semibold text-gray-800">{user.username}</td>
                      <td className="px-6 py-4 text-gray-700">{user.group}</td>
                      <td className="px-6 py-4">
                        {allPrivs.length > 0 ? (
                          <div className="truncate max-w-xs text-gray-700" title={allPrivs.join(", ")}>{allPrivs.join(", ")}</div>
                        ) : (
                          <span className="text-gray-400 italic">No privileges</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
<button
  onClick={() => { setEditUser(user); setShowEditUserModal(true); }}
  className="p-2 rounded-lg hover:bg-green-100 text-green-700 transition"
  title="Edit"
>
  <Pencil size={18} />
</button>


<button
  onClick={async () => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      await axios.delete(`${API}/users/${user.user_id}`);
      await fetchUsers();
    }
  }}
  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
  title="Delete"
>
  <Trash2 size={18} />
</button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={4} className="text-center py-6 text-gray-500 italic">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-gray-700">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-2 shadow-md bg-white
                         hover:border-green-400 focus:border-green-500 focus:ring-2 
                         focus:ring-green-300 transition"
            >
              {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm disabled:opacity-50 hover:bg-green-50 transition">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm transition
                  ${page === currentPage ? "bg-green-600 text-white border-green-600" : "hover:bg-green-50"}`}
              >
                {page}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm disabled:opacity-50 hover:bg-green-50 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button onClick={() => setShowGroupModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            <input type="text" placeholder="Group Name" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300" />
            <button onClick={handleAddGroup} className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">Save</button>
          </div>
        </div>
      )}

      {/* Privilege Modal */}
      {showPrivilegeModal && selectedGroupForPrivileges && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button onClick={() => setShowPrivilegeModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-4">Edit Privileges for {selectedGroupForPrivileges.group_name}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {allPrivilegesList.map((priv) => {
                const hasPriv = selectedGroupForPrivileges.privileges.includes(priv.privilege_name);
                return (
                  <label key={priv.privilege_id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPriv}
                      onChange={() => togglePrivilege(selectedGroupForPrivileges, priv)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-400 cursor-pointer"
                    />
                    <span>{priv.privilege_name}</span>
                  </label>
                );
              })}
            </div>
            <button onClick={() => setShowPrivilegeModal(false)} className="mt-4 w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">Done</button>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button onClick={() => setShowUserModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300" />
            <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300" />
            <select value={newUser.groupId} onChange={(e) => setNewUser({ ...newUser, groupId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300">
              <option value="">Select Group</option>
              {groups.map((g) => <option key={g.group_id} value={g.group_id}>{g.group_name}</option>)}
            </select>
            <button onClick={handleAddUser} className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">Save</button>
          </div>
        </div>
      )}


{/* Edit User Modal */}
{showEditUserModal && editUser && (
  <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
      <button
        onClick={() => setShowEditUserModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>
      <h3 className="text-xl font-bold mb-4">Edit User</h3>
      <input
        type="text"
        placeholder="Username"
        value={editUser.username}
        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300"
      />
      <input
        type="email"
        placeholder="Email"
        value={editUser.email}
        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300"
      />
      <select
        value={editUser.group_id || ""}
        onChange={(e) => setEditUser({ ...editUser, group_id: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:border-green-400 focus:ring-2 focus:ring-green-300"
      >
        <option value="">Select Group</option>
        {groups.map((g) => (
          <option key={g.group_id} value={g.group_id}>{g.group_name}</option>
        ))}
      </select>
      <button
        onClick={async () => {
          await axios.put(`${API}/users/${editUser.user_id}`, {
            username: editUser.username,
            email: editUser.email,
            groupId: Number(editUser.group_id),
          });
          await fetchUsers();
          setShowEditUserModal(false);
        }}
        className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        Save Changes
      </button>
    </div>
  </div>
)}




    </div>
  );
}
