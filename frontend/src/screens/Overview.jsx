import { useState } from "react";
import Fuse from "fuse.js";
import { Plus, Shield, User, X, Search, Filter } from "lucide-react";

function Dropdown({ icon: Icon, options, selected, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border rounded-xl px-4 py-2 shadow-sm bg-white hover:border-green-400 focus:ring-2 focus:ring-green-500 transition min-w-[150px]"
      >
        {Icon && <Icon className="text-green-600" size={16} />}
        <span className="truncate">{selected}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 bg-white border rounded-xl shadow-lg overflow-hidden">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setOpen(false);
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
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Admins",
      privileges: ["Manage Users", "Manage Groups", "View Reports"],
    },
    { id: 2, name: "Editors", privileges: ["Edit Content", "Publish Content"] },
  ]);

  const [users, setUsers] = useState([
    { id: 1, username: "admin", group: "Admins", privileges: ["Custom Access"] },
    { id: 2, username: "john", group: "Editors", privileges: [] },
    { id: 3, username: "mohamed", group: "Admins", privileges: ["Export Data"] },
  ]);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [selectedGroupForPrivileges, setSelectedGroupForPrivileges] = useState(null);

  const [newGroup, setNewGroup] = useState("");
  const [newUser, setNewUser] = useState({ username: "", group: "" });
  const [searchGroups, setSearchGroups] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedPrivilege, setSelectedPrivilege] = useState("All");

  // Central privileges list
  const allPrivilegesList = [
    "Manage Users",
    "Manage Groups",
    "View Reports",
    "Edit Content",
    "Publish Content",
    "Export Data",
    "Custom Access",
  ];

  const handleAddGroup = () => {
    if (!newGroup) return;
    setGroups([...groups, { id: Date.now(), name: newGroup, privileges: [] }]);
    setNewGroup("");
    setShowGroupModal(false);
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.group) return;
    setUsers([...users, { id: Date.now(), ...newUser, privileges: [] }]);
    setNewUser({ username: "", group: "" });
    setShowUserModal(false);
  };

  // Combine user + group privileges
  const getAllPrivileges = (user) => {
    const group = groups.find((g) => g.name === user.group);
    const groupPrivileges = group ? group.privileges : [];
    return [...new Set([...groupPrivileges, ...(user.privileges || [])])];
  };

  // Setup fuzzy search
  const fuseUsers = new Fuse(users, {
    keys: ["username", "group", "privileges"],
    threshold: 0.4,
  });

  const fuseGroups = new Fuse(groups, {
    keys: ["name", "privileges"],
    threshold: 0.4,
  });

  const filteredUsersRaw = searchUsers
    ? fuseUsers.search(searchUsers).map((result) => result.item)
    : users;

  const filteredGroups = searchGroups
    ? fuseGroups.search(searchGroups).map((result) => result.item)
    : groups;

  // collect all privileges for filter options
  const allPrivileges = Array.from(new Set(groups.flatMap((g) => g.privileges)));

  // apply group & privilege filters
  const filteredUsers = filteredUsersRaw.filter((user) => {
    const allPrivs = getAllPrivileges(user);
    const groupMatch = selectedGroup === "All" || user.group === selectedGroup;
    const privilegeMatch =
      selectedPrivilege === "All" || allPrivs.includes(selectedPrivilege);
    return groupMatch && privilegeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Admin Dashboard
      </h1>

      {/* Groups Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Shield className="text-green-600" /> Groups
          </h2>

          {/* Search + Add Group */}
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchGroups}
                onChange={(e) => setSearchGroups(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-green-500"
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
              <div
                key={group.id}
                className="rounded-2xl border border-gray-200 shadow-md p-5 hover:shadow-lg transition bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.privileges.length > 0 ? (
                    group.privileges.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full"
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">No privileges yet</span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedGroupForPrivileges(group);
                      setShowPrivilegeModal(true);
                    }}
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
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <User className="text-green-600" /> Users
          </h2>

          {/* Filters + Search + Add User */}
          <div className="flex items-center gap-4">
            <Dropdown
              icon={Shield}
              options={["All", ...groups.map((g) => g.name)]}
              selected={selectedGroup}
              onChange={setSelectedGroup}
            />

            <Dropdown
              icon={Filter}
              options={["All", ...allPrivileges]}
              selected={selectedPrivilege}
              onChange={setSelectedPrivilege}
            />

            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search users..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-green-500"
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

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-700 to-green-500 text-white">
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Group</th>
                <th className="px-6 py-3 text-left">All Privileges</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => {
                  const allPrivs = getAllPrivileges(user);
                  return (
                    <tr
                      key={user.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.group}</td>
                      <td className="px-6 py-4">
                        {allPrivs.length > 0 ? (
                          <div
                            className="truncate max-w-xs text-gray-700"
                            title={allPrivs.join(", ")}
                          >
                            {allPrivs.join(", ")}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No privileges</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button
              onClick={() => setShowGroupModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <button
              onClick={handleAddGroup}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Privilege Modal */}
      {showPrivilegeModal && selectedGroupForPrivileges && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button
              onClick={() => setShowPrivilegeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">
              Edit Privileges for {selectedGroupForPrivileges.name}
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {allPrivilegesList.map((priv) => {
                const hasPriv = selectedGroupForPrivileges.privileges.includes(priv);
                return (
                  <label
                    key={priv}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={hasPriv}
                      onChange={() => {
                        const updatedGroups = groups.map((g) =>
                          g.id === selectedGroupForPrivileges.id
                            ? {
                                ...g,
                                privileges: hasPriv
                                  ? g.privileges.filter((p) => p !== priv)
                                  : [...g.privileges, priv],
                              }
                            : g
                        );
                        setGroups(updatedGroups);
                        setSelectedGroupForPrivileges(
                          updatedGroups.find((g) => g.id === selectedGroupForPrivileges.id)
                        );
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded"
                    />
                    <span>{priv}</span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={() => setShowPrivilegeModal(false)}
              className="mt-4 w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <select
              value={newUser.group}
              onChange={(e) =>
                setNewUser({ ...newUser, group: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              <option value="">Select Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
