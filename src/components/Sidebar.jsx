import { Link, useLocation } from 'react-router-dom'

const HomeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 4L4 10v9h6v-5h4v5h6v-9z" />
  </svg>
)

const WatchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 6h16v12H4z" opacity="0.3" />
    <path d="M4 4h16v16H4zM6 18h12V6H6zm4-9l5 3-5 3z" />
  </svg>
)

const HistoryIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 3a9 9 0 1 0 8.95 8h-2.02A7 7 0 1 1 12 5v4l3.5 2.1L14.5 13 9 10V3z" />
  </svg>
)

const UploadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3l5 5h-3v6h-4V8H7z" />
    <path d="M5 18h14v2H5z" />
  </svg>
)

const ProfileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.31 0-7 1.66-7 3.5V20h14v-2.5C19 15.66 15.31 14 12 14z" />
  </svg>
)

const menuItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/watch', label: 'Watch', icon: WatchIcon },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/upload', label: 'Upload', icon: UploadIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
]

function isRouteActive(pathname, targetPath) {
  if (targetPath === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(targetPath)
}

export default function Sidebar({ isOpen = true }) {
  const location = useLocation()

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-y-auto transition-all duration-300 ${
        isOpen ? 'w-60' : 'w-20'
      }`}
      aria-label="Primary"
    >
      <div className="py-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isRouteActive(location.pathname, item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                active
                  ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon
                className={`w-6 h-6 shrink-0 ${
                  active ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              />
              <span
                className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden={!isOpen}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
