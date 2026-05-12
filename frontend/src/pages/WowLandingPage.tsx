/** Hosted WoW marketing page as the app root (`/`). Other routes stay on this Vite app. */
const WOW_URL =
  import.meta.env.VITE_WOW_URL ?? 'https://www.wowfinedining.com/wow.html'

export function WowLandingPage() {
  return (
    <div className="fixed inset-0 m-0 p-0 bg-black">
      <iframe
        title="WoW — Fast Fine Dining · Perugia"
        src={WOW_URL}
        className="block h-full w-full border-0"
        allow="fullscreen"
      />
    </div>
  )
}
