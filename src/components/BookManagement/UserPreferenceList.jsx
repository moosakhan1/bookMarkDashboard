"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

const users = [
  {
    id: "PREF-1201",
    name: "Frank Moore",
    avatar: "/placeholder.svg?height=40&width=40",
    genres: "Fiction, Biography",
    books: "The Great Gatsby, Sapiens",
    date: "Nov 01, 2025",
    status: "Reviewed",
  },
  {
    id: "PREF-1202",
    name: "Karen Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    genres: "Self-help, Business",
    books: "Atomic Habits, Deep Work",
    date: "Nov 25, 2025",
    status: "Pending",
  },
  {
    id: "PREF-1221",
    name: "Mona Lewis",
    avatar: "/placeholder.svg?height=40&width=40",
    genres: "Sci-Fi, Thriller",
    books: "1984",
    date: "Nov 25, 2025",
    status: "Reviewed",
  },
  {
    id: "PREF-1231",
    name: "Olivia Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    genres: "Psychology, Mindfulness",
    books: "The Power of Now",
    date: "Nov 25, 2025",
    status: "Pending",
  },
];

export default function UserPreferenceList() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.genres.toLowerCase().includes(search.toLowerCase()) ||
      u.books.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        User Preference List
      </h2>
      <p className="text-gray-500 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <div className="bg-white rounded-xl border border-[#E0DDDD] p-2 md:p-6">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto md:ml-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full border border-[#737373] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E7E7E7]"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#737373] bg-white text-[#737373]  w-full sm:w-auto">
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4H13V6H3V4ZM0 0H16V2H0V0ZM6 8H10V10H6V8Z"
                  fill="#737373"
                />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {[
                  "Form ID",
                  "User Name",
                  "Preferred Genres",
                  "Requested Books",
                  "Submitted Date",
                  "Status",
                  "Action",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-4 py-2 text-left text-sm font-bold text-[#1F1E1E]"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {u.id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-10 w-10 rounded-full object-cover bg-gray-300"
                      />
                      <span className="font-medium text-[#6B7280]">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {u.genres}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {u.books}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280] whitespace-nowrap">
                    {u.date}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        u.status === "Reviewed"
                          ? "bg-[#CAF9DB] text-[#166534]"
                          : "bg-[#E0DDDD] text-[#6B7280]"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className=" rounded-md  transition-colors"
                        title="View"
                      >
                        <svg
                          width="25"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M28.9816 14.6203C28.9406 14.5277 27.948 12.3258 25.7414 10.1191C22.8012 7.17891 19.0875 5.625 15 5.625C10.9125 5.625 7.19882 7.17891 4.25858 10.1191C2.05194 12.3258 1.05468 14.5312 1.01835 14.6203C0.965043 14.7402 0.9375 14.87 0.9375 15.0012C0.9375 15.1324 0.965043 15.2621 1.01835 15.382C1.05936 15.4746 2.05194 17.6754 4.25858 19.882C7.19882 22.8211 10.9125 24.375 15 24.375C19.0875 24.375 22.8012 22.8211 25.7414 19.882C27.948 17.6754 28.9406 15.4746 28.9816 15.382C29.0349 15.2621 29.0625 15.1324 29.0625 15.0012C29.0625 14.87 29.0349 14.7402 28.9816 14.6203ZM15 22.5C11.393 22.5 8.24179 21.1887 5.63319 18.6035C4.56285 17.5391 3.65224 16.3253 2.92968 15C3.65205 13.6745 4.56268 12.4608 5.63319 11.3965C8.24179 8.81133 11.393 7.5 15 7.5C18.607 7.5 21.7582 8.81133 24.3668 11.3965C25.4392 12.4605 26.3518 13.6743 27.0762 15C26.2312 16.5773 22.5504 22.5 15 22.5ZM15 9.375C13.8875 9.375 12.7999 9.7049 11.8749 10.323C10.9499 10.9411 10.2289 11.8196 9.80317 12.8474C9.37742 13.8752 9.26603 15.0062 9.48307 16.0974C9.70011 17.1885 10.2358 18.1908 11.0225 18.9775C11.8092 19.7641 12.8115 20.2999 13.9026 20.5169C14.9937 20.734 16.1247 20.6226 17.1526 20.1968C18.1804 19.7711 19.0589 19.0501 19.677 18.1251C20.2951 17.2001 20.625 16.1125 20.625 15C20.6234 13.5086 20.0303 12.0788 18.9758 11.0242C17.9212 9.96968 16.4914 9.37655 15 9.375ZM15 18.75C14.2583 18.75 13.5333 18.5301 12.9166 18.118C12.2999 17.706 11.8193 17.1203 11.5354 16.4351C11.2516 15.7498 11.1773 14.9958 11.322 14.2684C11.4667 13.541 11.8239 12.8728 12.3483 12.3483C12.8728 11.8239 13.541 11.4667 14.2684 11.3221C14.9958 11.1774 15.7498 11.2516 16.4351 11.5355C17.1203 11.8193 17.7059 12.2999 18.118 12.9166C18.5301 13.5333 18.75 14.2583 18.75 15C18.75 15.9946 18.3549 16.9484 17.6516 17.6516C16.9484 18.3549 15.9946 18.75 15 18.75Z"
                            fill="#6B7280"
                          />
                        </svg>
                      </button>
                      <button
                        className=" rounded-md  transition-colors"
                        title="Download"
                      >
                        <svg
                          width="25"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.375 3.75H5.625C5.12772 3.75 4.65081 3.94754 4.29917 4.29917C3.94754 4.65081 3.75 5.12772 3.75 5.625V24.375C3.75 24.8723 3.94754 25.3492 4.29917 25.7008C4.65081 26.0525 5.12772 26.25 5.625 26.25H24.375C24.8723 26.25 25.3492 26.0525 25.7008 25.7008C26.0525 25.3492 26.25 24.8723 26.25 24.375V5.625C26.25 5.12772 26.0525 4.65081 25.7008 4.29917C25.3492 3.94754 24.8723 3.75 24.375 3.75ZM22.5 12.1875H24.375V17.8125H22.5V12.1875ZM24.375 10.3125H22.5V5.625H24.375V10.3125ZM5.625 5.625H20.625V24.375H5.625V5.625ZM24.375 24.375H22.5V19.6875H24.375V24.375ZM17.7832 19.4531C17.4798 18.3204 16.7605 17.3437 15.7687 16.718C16.2954 16.1944 16.6548 15.5263 16.8013 14.7982C16.9478 14.0702 16.8748 13.3151 16.5917 12.6285C16.3085 11.942 15.8279 11.355 15.2107 10.942C14.5935 10.5289 13.8676 10.3084 13.125 10.3084C12.3824 10.3084 11.6565 10.5289 11.0393 10.942C10.4221 11.355 9.94149 11.942 9.65832 12.6285C9.37515 13.3151 9.30219 14.0702 9.4487 14.7982C9.5952 15.5263 9.95457 16.1944 10.4813 16.718C9.49014 17.3444 8.77102 18.3208 8.4668 19.4531C8.40464 19.694 8.44071 19.9497 8.56707 20.164C8.69344 20.3782 8.89975 20.5335 9.14062 20.5957C9.3815 20.6579 9.63719 20.6218 9.85147 20.4954C10.0657 20.3691 10.221 20.1627 10.2832 19.9219C10.5926 18.7207 11.8137 17.8125 13.125 17.8125C14.4363 17.8125 15.6586 18.7184 15.9668 19.9219C16.029 20.1627 16.1843 20.3691 16.3985 20.4954C16.6128 20.6218 16.8685 20.6579 17.1094 20.5957C17.3502 20.5335 17.5566 20.3782 17.6829 20.164C17.8093 19.9497 17.8454 19.694 17.7832 19.4531ZM11.25 14.0625C11.25 13.6917 11.36 13.3291 11.566 13.0208C11.772 12.7125 12.0649 12.4721 12.4075 12.3302C12.7501 12.1883 13.1271 12.1512 13.4908 12.2235C13.8545 12.2959 14.1886 12.4745 14.4508 12.7367C14.713 12.9989 14.8916 13.333 14.964 13.6967C15.0363 14.0604 14.9992 14.4374 14.8573 14.78C14.7154 15.1226 14.475 15.4155 14.1667 15.6215C13.8584 15.8275 13.4958 15.9375 13.125 15.9375C12.6277 15.9375 12.1508 15.74 11.7992 15.3883C11.4475 15.0367 11.25 14.5598 11.25 14.0625Z"
                            fill="#6B7280"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-10 w-10 rounded-full object-cover bg-gray-300"
                />
                <div>
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.id}</div>
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    u.status === "Reviewed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {u.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Genres:</span>{" "}
                {u.genres}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Books:</span>{" "}
                {u.books}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Date:</span>{" "}
                {u.date}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="p-2 rounded-md  transition-colors"
                  title="View"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28.9816 14.6203C28.9406 14.5277 27.948 12.3258 25.7414 10.1191C22.8012 7.17891 19.0875 5.625 15 5.625C10.9125 5.625 7.19882 7.17891 4.25858 10.1191C2.05194 12.3258 1.05468 14.5312 1.01835 14.6203C0.965043 14.7402 0.9375 14.87 0.9375 15.0012C0.9375 15.1324 0.965043 15.2621 1.01835 15.382C1.05936 15.4746 2.05194 17.6754 4.25858 19.882C7.19882 22.8211 10.9125 24.375 15 24.375C19.0875 24.375 22.8012 22.8211 25.7414 19.882C27.948 17.6754 28.9406 15.4746 28.9816 15.382C29.0349 15.2621 29.0625 15.1324 29.0625 15.0012C29.0625 14.87 29.0349 14.7402 28.9816 14.6203ZM15 22.5C11.393 22.5 8.24179 21.1887 5.63319 18.6035C4.56285 17.5391 3.65224 16.3253 2.92968 15C3.65205 13.6745 4.56268 12.4608 5.63319 11.3965C8.24179 8.81133 11.393 7.5 15 7.5C18.607 7.5 21.7582 8.81133 24.3668 11.3965C25.4392 12.4605 26.3518 13.6743 27.0762 15C26.2312 16.5773 22.5504 22.5 15 22.5ZM15 9.375C13.8875 9.375 12.7999 9.7049 11.8749 10.323C10.9499 10.9411 10.2289 11.8196 9.80317 12.8474C9.37742 13.8752 9.26603 15.0062 9.48307 16.0974C9.70011 17.1885 10.2358 18.1908 11.0225 18.9775C11.8092 19.7641 12.8115 20.2999 13.9026 20.5169C14.9937 20.734 16.1247 20.6226 17.1526 20.1968C18.1804 19.7711 19.0589 19.0501 19.677 18.1251C20.2951 17.2001 20.625 16.1125 20.625 15C20.6234 13.5086 20.0303 12.0788 18.9758 11.0242C17.9212 9.96968 16.4914 9.37655 15 9.375ZM15 18.75C14.2583 18.75 13.5333 18.5301 12.9166 18.118C12.2999 17.706 11.8193 17.1203 11.5354 16.4351C11.2516 15.7498 11.1773 14.9958 11.322 14.2684C11.4667 13.541 11.8239 12.8728 12.3483 12.3483C12.8728 11.8239 13.541 11.4667 14.2684 11.3221C14.9958 11.1774 15.7498 11.2516 16.4351 11.5355C17.1203 11.8193 17.7059 12.2999 18.118 12.9166C18.5301 13.5333 18.75 14.2583 18.75 15C18.75 15.9946 18.3549 16.9484 17.6516 17.6516C16.9484 18.3549 15.9946 18.75 15 18.75Z"
                      fill="#6B7280"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-md  transition-colors"
                  title="Download"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.375 3.75H5.625C5.12772 3.75 4.65081 3.94754 4.29917 4.29917C3.94754 4.65081 3.75 5.12772 3.75 5.625V24.375C3.75 24.8723 3.94754 25.3492 4.29917 25.7008C4.65081 26.0525 5.12772 26.25 5.625 26.25H24.375C24.8723 26.25 25.3492 26.0525 25.7008 25.7008C26.0525 25.3492 26.25 24.8723 26.25 24.375V5.625C26.25 5.12772 26.0525 4.65081 25.7008 4.29917C25.3492 3.94754 24.8723 3.75 24.375 3.75ZM22.5 12.1875H24.375V17.8125H22.5V12.1875ZM24.375 10.3125H22.5V5.625H24.375V10.3125ZM5.625 5.625H20.625V24.375H5.625V5.625ZM24.375 24.375H22.5V19.6875H24.375V24.375ZM17.7832 19.4531C17.4798 18.3204 16.7605 17.3437 15.7687 16.718C16.2954 16.1944 16.6548 15.5263 16.8013 14.7982C16.9478 14.0702 16.8748 13.3151 16.5917 12.6285C16.3085 11.942 15.8279 11.355 15.2107 10.942C14.5935 10.5289 13.8676 10.3084 13.125 10.3084C12.3824 10.3084 11.6565 10.5289 11.0393 10.942C10.4221 11.355 9.94149 11.942 9.65832 12.6285C9.37515 13.3151 9.30219 14.0702 9.4487 14.7982C9.5952 15.5263 9.95457 16.1944 10.4813 16.718C9.49014 17.3444 8.77102 18.3208 8.4668 19.4531C8.40464 19.694 8.44071 19.9497 8.56707 20.164C8.69344 20.3782 8.89975 20.5335 9.14062 20.5957C9.3815 20.6579 9.63719 20.6218 9.85147 20.4954C10.0657 20.3691 10.221 20.1627 10.2832 19.9219C10.5926 18.7207 11.8137 17.8125 13.125 17.8125C14.4363 17.8125 15.6586 18.7184 15.9668 19.9219C16.029 20.1627 16.1843 20.3691 16.3985 20.4954C16.6128 20.6218 16.8685 20.6579 17.1094 20.5957C17.3502 20.5335 17.5566 20.3782 17.6829 20.164C17.8093 19.9497 17.8454 19.694 17.7832 19.4531ZM11.25 14.0625C11.25 13.6917 11.36 13.3291 11.566 13.0208C11.772 12.7125 12.0649 12.4721 12.4075 12.3302C12.7501 12.1883 13.1271 12.1512 13.4908 12.2235C13.8545 12.2959 14.1886 12.4745 14.4508 12.7367C14.713 12.9989 14.8916 13.333 14.964 13.6967C15.0363 14.0604 14.9992 14.4374 14.8573 14.78C14.7154 15.1226 14.475 15.4155 14.1667 15.6215C13.8584 15.8275 13.4958 15.9375 13.125 15.9375C12.6277 15.9375 12.1508 15.74 11.7992 15.3883C11.4475 15.0367 11.25 14.5598 11.25 14.0625Z"
                      fill="#6B7280"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
