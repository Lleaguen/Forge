import { Button } from '../../../shared/components/ui/index'

export function UserProfileSettings() {
  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* SIDEBAR */}
      <aside className="w-64 border-r bg-white px-6 py-8">
        <h1 className="mb-10 text-xl font-bold text-[#2FA4A9]">
          Forge Web
        </h1>

        <nav className="space-y-2 text-sm">
          {['Dashboard', 'Projects', 'Tasks', 'Team', 'Settings'].map(
            item => (
              <div
                key={item}
                className={`rounded-lg px-4 py-2 ${
                  item === 'Settings'
                    ? 'bg-[#E6F6F7] text-[#2FA4A9] font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item}
              </div>
            )
          )}
        </nav>

        <button className="mt-10 flex items-center gap-2 text-sm text-red-500">
          ⎋ Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <input
            placeholder="Search tasks or settings..."
            className="w-96 rounded-lg border px-4 py-2 text-sm"
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">🔔</span>
            <div className="text-right">
              <p className="text-sm font-semibold">Alex Harrison</p>
              <p className="text-xs text-gray-400">
                Senior Manager
              </p>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              className="h-10 w-10 rounded-full"
            />
          </div>
        </div>

        {/* PROFILE CARD */}
        <section className="mb-6 rounded-xl border bg-white p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/100"
                className="h-24 w-24 rounded-full"
              />
              <button className="absolute bottom-0 right-0 rounded-full bg-[#2FA4A9] p-2 text-white">
                📷
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Alex Harrison
              </h2>
              <p className="text-gray-500">
                Senior Project Manager at Forge Creative
              </p>

              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-[#E6F6F7] px-3 py-1 text-xs font-semibold text-[#2FA4A9]">
                  VERIFIED ADMIN
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  MEMBER SINCE 2022
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONAL INFO */}
        <section className="mb-6 rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="rounded-lg border px-4 py-2"
              defaultValue="Alex Harrison"
              placeholder="Full Name"
            />
            <input
              className="rounded-lg border px-4 py-2"
              defaultValue="alex.h@forge-creative.com"
              placeholder="Email Address"
            />
          </div>

          <textarea
            className="mt-4 w-full rounded-lg border px-4 py-2"
            rows={4}
            defaultValue="Focused on delivering high-impact engineering solutions through collaborative project management."
          />
        </section>

        {/* ORGANIZATION */}
        <section className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Organization Management
          </h3>

          <div className="flex items-center justify-between">
            <select className="rounded-lg border px-4 py-2">
              <option>Forge Creative</option>
            </select>

            <Button variant="outline">
              + Join Organization
            </Button>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="mt-6 flex items-center justify-between">
          <button className="text-sm text-red-500">
            ✖ Deactivate My Account
          </button>

          <div className="flex gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
