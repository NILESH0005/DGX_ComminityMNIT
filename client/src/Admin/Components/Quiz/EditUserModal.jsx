import React, { useContext, useEffect, useState } from "react";
import ApiContext from "../../../context/ApiContext";
import Swal from "sweetalert2";

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  colleges,
  events,
  availableRoles,
  userToken,
  fetchData,
  onSaveSuccess,
}) => {
  // console.log("what is events", events);
  if (!isOpen || !user) return null;

  const [formData, setFormData] = useState({
    Name: "",
    EmailId: "",
    CollegeName: "",
    CollegeID: "",
    Designation: "",
    MobileNumber: "",
    Category: "",
    EventIDs: [],
    IsTestUser: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || "",
        EmailId: user.EmailId || "",
        CollegeName: user.CollegeName || "",
        CollegeID: user.CollegeID || "",
        Designation: user.Designation || "",
        MobileNumber: user.MobileNumber || "",
        Category: user.Category || "",
        EventIDs: user.EventIDs || [],
        IsTestUser: user.IsTestUser || false,
      });
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    const result = await fetchData(
      `user/getUserEvents?userId=${user.UserID}`,
      "GET",
      {},
      {
        "Content-Type": "application/json",
        "auth-token": userToken,
      },
    );
    if (result.success) {
      setFormData((prev) => ({
        ...prev,
        EventIDs: result.data,
      }));
    }
  };

  const handleUpdateUser = async () => {
    const endpoint = "user/updateUser";

    const result = await fetchData(
      endpoint,
      "POST",
      {
        UserID: user.UserID,
        ...formData,
      },
      {
        "Content-Type": "application/json",
        "auth-token": userToken,
      },
    );

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User updated successfully",
      });

      onSaveSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Edit User Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update user information and permissions
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-DGXblue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.EmailId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      EmailId: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-DGXblue"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization
                </label>

                <select
                  value={formData.CollegeID}
                  onChange={(e) => {
                    const selectedCollege = colleges.find(
                      (c) => c.CollegeID == e.target.value,
                    );

                    setFormData({
                      ...formData,
                      CollegeID: e.target.value,
                      CollegeName: selectedCollege?.CollegeName || "",
                    });
                  }}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">Select Organization</option>

                  {colleges.map((college) => (
                    <option key={college.CollegeID} value={college.CollegeID}>
                      {college.CollegeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Designation
                </label>

                <input
                  type="text"
                  value={formData.Designation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Designation: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number
                </label>

                <input
                  type="text"
                  value={formData.MobileNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      MobileNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  value={formData.Category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Category: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="Faculty">Faculty</option>
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>
          </div>
          {/* Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Events</h3>

            <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 max-h-48 overflow-y-auto">
              {events.map((event) => (
                <label key={event.EventID} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.EventIDs.includes(event.EventID)}
                    onChange={(e) => {
                      let updated = [...formData.EventIDs];

                      if (e.target.checked) {
                        updated.push(event.EventID);
                      } else {
                        updated = updated.filter((id) => id !== event.EventID);
                      }

                      setFormData({
                        ...formData,
                        EventIDs: updated,
                      });
                    }}
                  />

                  <span>{event.EventName}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Test User */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.IsTestUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    IsTestUser: e.target.checked,
                  })
                }
              />

              <span className="font-medium">Mark as Test User</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateUser}
            className="px-6 py-3 bg-DGXblue text-white rounded-lg hover:bg-blue-700"
          >
            Update User
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
