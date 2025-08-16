import { LandingHeader } from './landing-header';
import { Footer } from './footer';

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
